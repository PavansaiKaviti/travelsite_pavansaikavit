const appEr = require("../../utils/appEr");
const User = require("../../model/user/User");
const bcrypt = require("bcryptjs");
//!
// loginform frontend
const loginform = (req, res) => {
  res.render("users/login.ejs", { error: "" });
};
//register form
const registerform = (req, res) => {
  res.render("users/Register.ejs", { error: "" });
};
// const profilepage = (req, res) => {
//   res.render("users/profile.ejs", { user: " " });
// };
const uploadprofilepic = (req, res) => {
  res.render("users/uploadProfilePhoto.ejs", { error: "" });
};
const uploadcoverphoto = (req, res) => {
  res.render("users/uploadcoverphoto.ejs", { error: "" });
};
const passwordupdate = (req, res) => {
  res.render("users/UpdatePassword.ejs", { error: null });
};
//!
//register -this check if the user is a registered user are not if not it register the user
const registerContol = async (req, res, next) => {
  try {
    const { fullname, email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const userfound = await User.findOne({ email });
    //condition for checking a field if they are empty
    if (!fullname || !email || !password) {
      // return next(
      //   appEr("these are vaild fields please enter them  to fetch your details")
      // );
      return res.render("users/Register.ejs", {
        error: "all fields are required",
      });
    }
    if (userfound) {
      // return next(appEr("user already registered"));
      return res.render("users/Register.ejs", {
        error: "user already registered",
      });
      // res.json({ status: "failure", data: "user already registered"  });
    } else {
      const hasspassword = await bcrypt.hash(password, salt);
      const usercreated = await User.create({
        fullname,
        email,
        password: hasspassword,
      });
      // res.redirect("/api/v1/users/login");
      return res.render("users/Register.ejs", {
        error: "successfully registered login again",
      });
    }
  } catch (error) {
    res.json({ error_found: error });
  }
};
//login- these verify the user is a valid user or not if not it shows an error and also pops if user enter incorrect password
const loginControl = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const userfound = (await User.findOne({ email }))
      ? await User.findOne({ email })
      : false;
    if (userfound) {
      //userfound
      const match = (await bcrypt.compare(password, userfound.password))
        ? await bcrypt.compare(password, userfound.password)
        : false;
      if (match) {
        req.session.userId = userfound._id;
        res.redirect("/api/v1/users/profile-page");
      } else {
        // return next(appEr("login failed check your credentials"));
        return res.render("users/login.ejs", {
          error: "login failed check your credentials",
        });
      }
    } else {
      // return next(appEr("please register to login "));
      // res.json({ status: "failure", data: "please register to login " });
      return res.render("users/login.ejs", {
        error: "please register to login",
      });
    }
  } catch (error) {
    res.json({ error_found: error });
  }
};
//particular user detail
const useridControl = async (req, res) => {
  try {
    const Id = req.params.id;
    const user = await User.findById(Id);
    // res.json({ status: "success", data: user });
    res.render("users/UpdateUser.ejs", { error: "" });
  } catch (error) {
    res.json({ error_found: error });
  }
};

const profileidControl = async (req, res) => {
  try {
    const Id = req.session.userId;
    const user = await User.findById(Id).populate("posts");
    // res.json({ status: "success", data: user });
    res.render("users/profile.ejs", { user });
  } catch (error) {
    res.json({ error_found: error });
  }
};

const profileuploadControl = async (req, res, next) => {
  try {
    // find user first then append then update the data into the bd
    const id = req.session.userId;
    const userFound = (await User.findById(id))
      ? await User.findById(id)
      : false;
    if (!req.file) {
      return res.render("users/uploadProfilePhoto.ejs", {
        error: " please upload the file",
      });
    }
    if (userFound) {
      const profileUploded = await User.findByIdAndUpdate(
        id,
        { profileImage: req.file.path },
        { new: true }
      );
      res.redirect("/api/v1/users/profile-page");
      // res.json({ status: "success", data: profileUploded });
    } else {
      return res.render("users/uploadProfilePhoto.ejs", {
        error: " user not found",
      });
    }
  } catch (error) {
    return res.render("users/uploadProfilePhoto.ejs", {
      error: error.message,
    });
  }
};

const coverimageControl = async (req, res) => {
  try {
    const id = req.session.userId;
    const userFound = (await User.findById(id))
      ? await User.findById(id)
      : false;
    if (!req.file) {
      return res.render("users/uploadcoverphoto.ejs", {
        error: " please upload the file",
      });
    }
    if (userFound) {
      const profileUploded = await User.findByIdAndUpdate(
        id,
        { coverImage: req.file.path },
        { new: true }
      );
      res.redirect("/api/v1/users/profile-page");
    } else {
      return res.render("users/uploadcoverphoto.ejs", {
        error: " user not found",
      });
      // return next(appEr("user not found"), 500);
    }
  } catch (error) {
    return res.render("users/uploadcoverphoto.ejs", {
      error: error.message,
    });
  }
};
const passwordControl = async (req, res, next) => {
  try {
    const { password } = req.body;
    if (password) {
      const oldpass = await User.findById(req.session.userId);
      const match = (await bcrypt.compare(password, oldpass.password))
        ? true
        : false;
      if (match) {
        return res.render("users/UpdatePassword.ejs", {
          error: " don't use old passwords",
        });
      } else {
        const salt = await bcrypt.genSalt(10);
        const hashpass = await bcrypt.hash(password, salt);
        const passwordupdate = await User.findByIdAndUpdate(
          req.params.id,
          {
            password: hashpass,
          },
          { new: true }
        );
        // res.json({ status: "success", data: passwordupdate });
        return res.render("users/UpdatePassword.ejs", {
          error: "password updated Successfully",
        });
      }
    } else {
      // return next(appEr("please enter the newpassword to update"));
      return res.render("users/UpdatePassword.ejs", {
        error: "please enter the newpassword to update",
      });
    }
  } catch (error) {
    return res.render("users/UpdatePassword.ejs", {
      error: error.message,
    });
  }
};
const user_updateControl = async (req, res, next) => {
  const { fullname, email } = req.body;
  try {
    // if (!fullname && !email) {
    //   return res.redirect("/api/v1/users/profile-page");
    // }
    if (email) {
      const checkEmail = (await User.findOne({ email }))
        ? await User.findOne({ email })
        : false;
      if (checkEmail) {
        return res.render("users/UpdateUser.ejs", {
          error: "email is already exists",
        });
      } else {
        await User.findByIdAndUpdate(
          req.session.userId,
          { fullname, email },
          { new: true }
        );
        res.redirect("/api/v1/users/profile-page");
        // res.json({ status: "success", data: changed });
      }
    }
    if (!fullname && !email) {
      return res.redirect("/api/v1/users/profile-page");
    } else {
      return res.render("users/UpdateUser.ejs", {
        error: "all fields are required",
      });
    }
  } catch (error) {
    // res.json({ error_found: error });
    return res.render("users/UpdateUser.ejs", {
      error: error.message,
    });
  }
};
const logoutControl = async (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};

module.exports = {
  registerContol,
  loginControl,
  useridControl,
  profileidControl,
  profileuploadControl,
  coverimageControl,
  passwordControl,
  user_updateControl,
  logoutControl,
  loginform,
  registerform,
  // profilepage,
  uploadprofilepic,
  uploadcoverphoto,
  passwordupdate,
};
