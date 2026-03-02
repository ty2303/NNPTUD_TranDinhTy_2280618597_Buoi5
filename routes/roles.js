var express = require('express');
var router = express.Router();
var Role = require('../models/Role');

/* GET - Lấy tất cả roles (không bị xoá mềm) */
router.get('/', async function(req, res, next) {
  try {
    let roles = await Role.find({ isDeleted: false });
    res.json({
      success: true,
      data: roles,
      total: roles.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/* GET - Lấy role theo id */
router.get('/:id', async function(req, res, next) {
  try {
    let role = await Role.findOne({ _id: req.params.id, isDeleted: false });

    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }

    res.json({
      success: true,
      data: role
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/* POST - Tạo role mới */
router.post('/', async function(req, res, next) {
  try {
    let role = await Role.create(req.body);
    res.status(201).json({
      success: true,
      data: role
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

/* PUT - Cập nhật role */
router.put('/:id', async function(req, res, next) {
  try {
    let role = await Role.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      req.body,
      { new: true, runValidators: true }
    );

    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }

    res.json({
      success: true,
      data: role
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

/* DELETE - Xoá mềm role */
router.delete('/:id', async function(req, res, next) {
  try {
    let role = await Role.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );

    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }

    res.json({
      success: true,
      message: 'Role deleted successfully (soft delete)'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
