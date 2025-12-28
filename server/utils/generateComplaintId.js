import Complaint from '../models/Complaint.js';

const generateComplaintId = async () => {
  const currentYear = new Date().getFullYear();
  const prefix = `COMP-${currentYear}-`;
  
  // Find the latest complaint for this year
  const latestComplaint = await Complaint.findOne({
    complaintId: { $regex: `^${prefix}` }
  }).sort({ complaintId: -1 });

  let nextNumber = 1;
  if (latestComplaint) {
    const lastNumber = parseInt(latestComplaint.complaintId.split('-')[2]);
    nextNumber = lastNumber + 1;
  }

  // Pad with zeros to make it 4 digits
  const paddedNumber = nextNumber.toString().padStart(4, '0');
  return `${prefix}${paddedNumber}`;
};

export default generateComplaintId;