var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var User = require('../models/User');

/* POST /register - Đăng ký tài khoản mới */
router.post('/register', async function(req, res, next) {
  try {
    let { username, password, email, fullName, role } = req.body;

    // Validate required fields
    if (!username || !password || !email) {
      return res.status(400).json({
        success: false,
        message: 'Username, password and email are required'
      });
    }

    // Kiểm tra username đã tồn tại chưa
    let existingUser = await User.findOne({
      $or: [{ username: username }, { email: email }],
      isDeleted: false
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: existingUser.username === username
          ? 'Username already exists'
          : 'Email already exists'
      });
    }

    // Hash password
    let salt = await bcrypt.genSalt(10);
    let hashedPassword = await bcrypt.hash(password, salt);

    // Tạo user mới
    let user = await User.create({
      username,
      password: hashedPassword,
      email,
      fullName: fullName || '',
      role: role || undefined
    });

    // Trả về user nhưng không trả password
    let userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: userResponse
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

/* GET - Lấy tất cả users (không bị xoá mềm), populate role */
router.get('/', async function(req, res, next) {
  try {
    let users = await User.find({ isDeleted: false }).populate('role');
    res.json({
      success: true,
      data: users,
      total: users.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/* GET - Lấy user theo id */
router.get('/:id', async function(req, res, next) {
  try {
    let user = await User.findOne({ _id: req.params.id, isDeleted: false }).populate('role');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/* POST - Tạo user mới */
router.post('/', async function(req, res, next) {
  try {
    let user = await User.create(req.body);
    res.status(201).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

/* PUT - Cập nhật user */
router.put('/:id', async function(req, res, next) {
  try {
    let user = await User.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      req.body,
      { new: true, runValidators: true }
    ).populate('role');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

/* DELETE - Xoá mềm user */
router.delete('/:id', async function(req, res, next) {
  try {
    let user = await User.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully (soft delete)'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/* POST /enable - Truyền email + username, nếu đúng thì chuyển status = true */
router.post('/enable', async function(req, res, next) {
  try {
    let { email, username } = req.body;

    if (!email || !username) {
      return res.status(400).json({
        success: false,
        message: 'Email and username are required'
      });
    }

    let user = await User.findOne({
      email: email,
      username: username,
      isDeleted: false
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found with provided email and username'
      });
    }

    user.status = true;
    await user.save();

    res.json({
      success: true,
      message: 'User enabled successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/* POST /disable - Truyền email + username, nếu đúng thì chuyển status = false */
router.post('/disable', async function(req, res, next) {
  try {
    let { email, username } = req.body;

    if (!email || !username) {
      return res.status(400).json({
        success: false,
        message: 'Email and username are required'
      });
    }

    let user = await User.findOne({
      email: email,
      username: username,
      isDeleted: false
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found with provided email and username'
      });
    }

    user.status = false;
    await user.save();

    res.json({
      success: true,
      message: 'User disabled successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
