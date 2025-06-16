import { Request, Response } from 'express';
import Complaint from '../models/complaint-model';
import branchModel from '../models/branch-model';
import { start } from 'repl';

export const getReport = async (req: Request, res: Response) => {
  try {
    // Extract and parse dates from query params

    const startDate = req.query.start ? new Date(req.query.start as string) : null;
    const endDate = req.query.end ? new Date(req.query.end as string) : null;

    // IST offset in milliseconds (UTC+5:30)
    const IST_OFFSET = 5.5 * 60 * 60 * 1000;

    // Adjust to start of local day
    if (startDate) startDate.setHours(0, 0, 0, 0);
    if (endDate) endDate.setHours(23, 59, 59, 999);

    // Subtract IST offset so comparisons happen correctly against UTC-stored dates
    const startUtc = startDate ? new Date(startDate.getTime() + IST_OFFSET) : null;
    const endUtc = endDate ? new Date(endDate.getTime() + IST_OFFSET) : null;


    const branchCode = req.query.branchCode ? (req.query.branchCode as string) : null;
    console.log('Start date after:', startUtc);

    if (!startDate || !endDate || isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({ message: 'Invalid or missing start/end date query parameters.' });
    }

    if (startDate > endDate) {
      return res.status(400).json({ message: 'Start date cannot be after end date.' });
    }

    if (branchCode) {
      // Branch-specific summary
      const branchSummary = await generateBranchSummary(startUtc as Date, endUtc as Date, branchCode);
      return res.json(branchSummary);
    } else {
      // Overall summary
      const summary = await generateSummary(startUtc as Date, endUtc as Date);
      return res.json(summary);
    }
  } catch (error) {
    console.error('Error generating report summary:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const generateSummary = async (startDate: Date, endDate: Date) => {
  const dateFilter = {
    createdAt: {
      $gte: startDate,
      $lte: endDate,
    },
  };
  console.log(`Generating overall summary from`, startDate, startDate.toISOString());
  // Counts with date filter

  const total = await Complaint.countDocuments(dateFilter);
  console.log(`Total complaints in date range: ${total}`);
  const resolved = await Complaint.countDocuments({ ...dateFilter, status: 'resolved' });
  const pending = await Complaint.countDocuments({ ...dateFilter, status: 'pending' });
  const inProgress = await Complaint.countDocuments({ ...dateFilter, status: 'in_progress' });
  const anonymousCount = await Complaint.countDocuments({ ...dateFilter, isAnonymous: true });

  const topBranches = await Complaint.aggregate([
    { $match: dateFilter },
    {
      $group: {
        _id: '$branchCode',
        count: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: 'branches',
        localField: '_id',
        foreignField: 'branchCode',
        as: 'branchInfo',
      },
    },
    { $unwind: { path: '$branchInfo', preserveNullAndEmptyArrays: true } },
    { $sort: { count: -1 } },
    { $limit: 3 },
  ]);

  const highestPendingBranch = await Complaint.aggregate([
    { $match: { ...dateFilter, status: 'pending' } },
    {
      $group: {
        _id: '$branchCode',
        pendingCount: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: 'branches',
        localField: '_id',
        foreignField: 'branchCode',
        as: 'branchInfo',
      },
    },
    { $unwind: { path: '$branchInfo', preserveNullAndEmptyArrays: true } },
    { $sort: { pendingCount: -1 } },
    { $limit: 1 },
  ]);

  const branchWithHighestPending = highestPendingBranch[0]
    ? {
        branch_code: highestPendingBranch[0]._id,
        branch_name: highestPendingBranch[0].branchInfo?.branchName || 'Unknown Branch',
        pending: highestPendingBranch[0].pendingCount,
      }
    : null;

  const frequentComplainers = await Complaint.aggregate([
    { $match: { ...dateFilter, isAnonymous: false } },
    {
      $group: {
        _id: '$createdBy',
        count: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'userInfo',
      },
    },
    { $unwind: { path: '$userInfo', preserveNullAndEmptyArrays: true } },
    { $sort: { count: -1 } },
    { $limit: 3 },
  ]);

  return {
    total_complaints: total,
    resolved,
    pending,
    in_progress: inProgress,
    anonymous_complaints_ratio: total > 0 ? (anonymousCount / total).toFixed(2) : '0.00',
    top_branches_by_complaints: topBranches.map((b) => ({
      branch_code: b._id,
      branch_name: b.branchInfo?.branchName || 'Unknown Branch',
      count: b.count,
    })),
    branch_with_highest_pending: branchWithHighestPending,
    most_frequent_complainers: frequentComplainers.map((u) => ({
      user_id: u._id? u._id.toString() : 'Unknown Id',
      name: u.userInfo?.fullName || 'Unknown Username',
      count: u.count,
    })),
  };
};

export const generateBranchSummary = async (startDate: Date, endDate: Date, branchCode: String) => {
    console.log(`Generating branch summary for ${branchCode} from ${startDate.toISOString()} to ${endDate.toISOString()}`);
  const baseFilter: any = {
    createdAt: { $gte: startDate, $lte: endDate },
  };

  if (branchCode) {
    baseFilter.branchCode = branchCode;
  }

  const total = await Complaint.countDocuments(baseFilter);
  const resolved = await Complaint.countDocuments({ ...baseFilter, status: 'resolved' });
  const pending = await Complaint.countDocuments({ ...baseFilter, status: 'pending' });
  const inProgress = await Complaint.countDocuments({ ...baseFilter, status: 'in_progress' });
  const anonymousCount = await Complaint.countDocuments({ ...baseFilter, isAnonymous: true });

  if (branchCode) {
    // Branch level report — focus on this single branch

    // Most frequent complainants at branch
    const frequentComplainers = await Complaint.aggregate([
      { $match: { ...baseFilter, isAnonymous: false } },
      {
        $group: {
          _id: '$createdBy',
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userInfo',
        },
      },
      { $unwind: { path: '$userInfo', preserveNullAndEmptyArrays: true } },
      { $sort: { count: -1 } },
      { $limit: 3 },
    ]);

    // Fetch branch info for the report header
    const branch = await branchModel.findOne({ branchCode });

    return {
      branch_code: branchCode,
      branch_name: branch?.branchName || 'Unknown Branch',
      total_complaints: total,
      resolved,
      pending,
      in_progress: inProgress,
      anonymous_complaints_ratio: total > 0 ? (anonymousCount / total).toFixed(2) : '0.00',
      most_frequent_complainers: frequentComplainers.map((u) => ({
        user_id: u._id ? u._id.toString() : 'Unknown Id',
        name: u.userInfo?.fullName || 'Unknown Username',
        count: u.count,
      })),
    };
  } else {
    // Admin-level report (all branches)

    const topBranches = await Complaint.aggregate([
      { $match: baseFilter },
      {
        $group: {
          _id: '$branchCode',
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'branches',
          localField: '_id',
          foreignField: 'branchCode',
          as: 'branchInfo',
        },
      },
      { $unwind: { path: '$branchInfo', preserveNullAndEmptyArrays: true } },
      { $sort: { count: -1 } },
      { $limit: 3 },
    ]);

    const highestPendingBranch = await Complaint.aggregate([
      { $match: { ...baseFilter, status: 'pending' } },
      {
        $group: {
          _id: '$branchCode',
          pendingCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'branches',
          localField: '_id',
          foreignField: 'branchCode',
          as: 'branchInfo',
        },
      },
      { $unwind: { path: '$branchInfo', preserveNullAndEmptyArrays: true } },
      { $sort: { pendingCount: -1 } },
      { $limit: 1 },
    ]);

    const branchWithHighestPending = highestPendingBranch[0]
      ? {
          branch_code: highestPendingBranch[0]._id,
          branch_name: highestPendingBranch[0].branchInfo?.branchName || 'Unknown Branch',
          pending: highestPendingBranch[0].pendingCount,
        }
      : null;

    const frequentComplainers = await Complaint.aggregate([
      { $match: { ...baseFilter, isAnonymous: false } },
      {
        $group: {
          _id: '$createdBy',
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userInfo',
        },
      },
      { $unwind: { path: '$userInfo', preserveNullAndEmptyArrays: true } },
      { $sort: { count: -1 } },
      { $limit: 3 },
    ]);

    return {
      total_complaints: total,
      resolved,
      pending,
      in_progress: inProgress,
      anonymous_complaints_ratio: total > 0 ? (anonymousCount / total).toFixed(2) : '0.00',
      top_branches_by_complaints: topBranches.map((b) => ({
        branch_code: b._id,
        branch_name: b.branchInfo?.branchName || 'Unknown Branch',
        count: b.count,
      })),
      branch_with_highest_pending: branchWithHighestPending,
      most_frequent_complainers: frequentComplainers.map((u) => ({
        user_id: u._id ? u._id.toString() : 'Unknown Id',
        name: u.userInfo?.fullName || 'Unknown Username',
        count: u.count,
      })),
    };
  }
};