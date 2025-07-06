const Member = require("../models/Member");

exports.addMember = async (req, res) => {
  try {
    const member = await Member.create(req.body);
    res.status(201).json(member);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getMemberBorrowedBooks = async (req, res) => {
  try {
    const member = await Member.findById(req.params.memberId).populate(
      "borrowedBooks"
    );
    if (!member) return res.status(404).json({ error: "Member not found" });
    res.status(200).json(member.borrowedBooks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
