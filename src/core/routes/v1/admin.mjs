"use strict";

// /src/routes/admin.mjs
import express from "express";
import path, { dirname, join } from "path";
import { fileURLToPath } from "url";
import { BasicAuth, BearerAuth } from "../../middlewares/authentication.mjs";
import { cookieOptions } from "../../configuration/storage.mjs";
import upload from "../../middlewares/upload.mjs";
import User from "../../classes/User.mjs";
import validate from "../../middlewares/validation.mjs";
import {
  userLoginSchema,
  userRegisterSchema,
} from "../../validations/userValidation.mjs";
import {
  access,
  refresh,
  verify,
  hash,
  compare,
} from "../../utilities/security.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 301 Moved Permanently
// 302 Moved Temporarily
// 308 Permanent Redirect

const router = express.Router();

/** Get the admin page. */
router.get("/", BearerAuth, (req, res, next) => {
  try {
    res.links({
      next: "http://demo.com?page=2",
      middle: "http://demo.com?page=4",
      last: "http://demo.com?page=6",
    });
    // res.status(200).sendFile(join(__dirname, "../views/admin.html"));
    res.render("admin", {
      title: "Admin Dashboard - [App Name]",
      heading: "Admin Panel",
      subheading:
        "Welcome to the Admin Panel. Manage user accounts, update settings, and oversee content efficiently—all in one secure location.",
      user: res.locals.user,
      layout: "main",
    });
    console.log(res.get("link"));
  } catch (error) {
    error.status = 500;
    next(error);
  }
});

/** Reauthentication without exposing the primary credentials. */
router.post("/refresh", (req, res, next) => {
  try {
    const decodedResult = verify(req.signedCookies.refresh);
    const user = {
      anonymous: decodedResult.anonymous,
      id: decodedResult.id,
      username: decodedResult.username,
      email: decodedResult.email,
      firstName: decodedResult.firstName,
      lastName: decodedResult.lastName,
      role: decodedResult.role,
      status: decodedResult.status,
      settings: decodedResult.settings,
      lastLogin: decodedResult.lastLogin,
      failedLoginAttempts: decodedResult.failedLoginAttempts,
      createdAt: decodedResult.createdAt,
      updatedAt: decodedResult.updatedAt,
    };
    console.log("User from /refresh");
    console.log(user);
    const token = refresh(user);
    res.cookie("refresh", token, cookieOptions());
    res.redirect(308, "access");
  } catch (error) {
    error.status = 500;
    next(error);
  }
});

/** Get new access token. */
router.post("/access", async (req, res, next) => {
  try {
    if (req.signedCookies.refresh) {
      const decodedResult = verify(req.signedCookies.refresh);
      const user = {
        anonymous: decodedResult.anonymous,
        id: decodedResult.id,
        username: decodedResult.username,
        email: decodedResult.email,
        firstName: decodedResult.firstName,
        lastName: decodedResult.lastName,
        role: decodedResult.role,
        status: decodedResult.status,
        settings: decodedResult.settings,
        lastLogin: decodedResult.lastLogin,
        failedLoginAttempts: decodedResult.failedLoginAttempts,
        createdAt: decodedResult.createdAt,
        updatedAt: decodedResult.updatedAt,
      };
      console.log("User from /access");
      console.log(user);
      const token = access(user);
      res.cookie("access", token, cookieOptions("access"));
      res.redirect(req.headers.referer);
    }
  } catch (error) {
    error.status = 500;
    next(error);
  }
});

/** User registration interface. */
router.get("/register", (req, res) => {
  try {
    // res.status(200).sendFile(join(__dirname, "../views/register.html"));
    res.render("register", {
      title: "Register - [App Name]",
      heading: "Create Your Account",
      subheading:
        "Join our community in just a few steps! Create your account to start exploring everything [App Name] has to offer. Get started for free. No credit card required.",
      layout: "index",
    });
  } catch (error) {
    error.status = 500;
    next(error);
  }
});

// Enforce Strong Password Policies
// Require a minimum length (e.g., 12+ characters).
// Include complexity rules (uppercase, lowercase, numbers, special characters).
// Check passwords against known breached password lists.

/** User registration back-end. */
router.post(
  "/register",
  validate(userRegisterSchema),
  async (req, res, next) => {
    try {
      const { username, email, password, firstName, lastName, role } = req.body;
      const hashedPassword = hash(password);
      const user = new User({
        username,
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role,
      });
      await user.save();
      res.status(201).json({
        success: true,
        message: "User registered successfully.",
      });
    } catch (error) {
      error.status = 500;
      next(error);
    }
  }
);

/** User login interface. */
router.get("/signin", (req, res) => {
  try {
    // res.status(200).sendFile(join(__dirname, "../views/login.html"));
    // Serves the body of the page aka "login.hbs" to the container //aka "index.hbs"
    res.status(200).json({
      title: "Sign In - [App Name]",
      heading: "Sign In to Your Account",
      subheading:
        "Welcome back! Enter your credentials to access your personalized dashboard and stay on top of everything that matters.",
      layout: "index",
    });
  } catch (error) {
    error.status = 500;
    next(error);
  }
});

/** User login back-end. */
router.post("/signin", validate(userLoginSchema), async (req, res, next) => {
  try {
    const { username, password } = req.body;
    try {
      const user = await User.findOne(username);
      if (!user)
        res
          .status(401)
          .json({ success: false, message: "User cannot be found." });
      const passwordMatch = compare(password, user.password);
      if (!passwordMatch)
        res.status(401).json({
          success: false,
          message: "Password doesn't match.",
        });
      req.user = await user.save();
      const accessToken = refresh(req.user);
      const refreshToken = refresh(req.user);
      res.cookie("access", accessToken, cookieOptions("access"));
      res.cookie("refresh", refreshToken, cookieOptions());

      // regenerate the session, which is good practice to help
      // guard against forms of session fixation
      req.session.regenerate(function (error) {
        if (error) next(error);

        // store user information in session, typically a user id
        req.session.user = req.user;

        // save the session before redirection to ensure page
        // load does not happen before session is saved
        req.session.save(function (error) {
          if (error) next(error);
          res.redirect("https://app.abuein.com/portal/dashboard");
        });
      });
    } catch (error) {
      error.status = 401;
      next(error);
    }
  } catch (error) {
    error.status = 500;
    next(error);
  }
});

/** User signout interface. */
router.get("/signout", (req, res) => {
  try {
    // clear the user from the session object and save.
    // this will ensure that re-using the old session id
    // does not have a logged in user
    req.session.user = null;
    req.session.save((error) => {
      if (error) next(error);
      // regenerate the session, which is good practice to help
      // guard against forms of session fixation
      req.session.regenerate((error) => {
        if (error) next(error);
        res.render("signout", {
          title: "Sign Out - [App Name]",
          heading: "You've Signed Out",
          subheading:
            "You've successfully signed out. For your security, be sure to close your browser. We'll be here when you're ready to return!",
          layout: "index",
        });
      });
    });
  } catch (error) {
    error.status = 500;
    next(error);
  }
});

/** User signout back-end logic. */
router.post("/signout", (req, res) => {
  try {
    redirect("signout");
  } catch (error) {
    error.status = 500;
    next(error);
  }
});

/** User signout interface. */
router.get("/password-reset", (req, res) => {
  try {
    // clear the user from the session object and save.
    // this will ensure that re-using the old session id
    // does not have a logged in user
    req.session.user = null;
    req.session.save((error) => {
      if (error) next(error);
      // regenerate the session, which is good practice to help
      // guard against forms of session fixation
      req.session.regenerate((error) => {
        if (error) next(error);
        res.render("reset", {
          title: "Password Reset - [App Name]",
          heading: "You've Signed Out",
          subheading:
            "Please specify your email address to receive instructions for resetting it.",
          layout: "index",
        });
      });
    });
  } catch (error) {
    error.status = 500;
    next(error);
  }
});

/** User signout back-end logic. */
router.post("/password-reset", (req, res) => {
  try {
    redirect("password-reset");
  } catch (error) {
    error.status = 500;
    next(error);
  }
});

/** Single file upload. */
router.get("/upload", BearerAuth, (req, res) => {
  res.render("upload", {
    title: "Upload - [App Name]",
    heading: "Upload Your Files",
    subheading:
      "Upload your documents and files quickly and securely. Supported formats include [list formats]. Start by selecting your file below.",
    user: res.locals.user,
    layout: "main",
  });
});

/** Single file upload. */
router.post("/upload", BearerAuth, upload.single("file"), (req, res) => {
  console.log(req.file);
  res.render("uploaded", {
    title: "My Uploads - [App Name]",
    heading: "Uploaded Files",
    subheading:
      "Here's a list of all your recent uploads. You can review, manage, or download your files anytime from this page.",
    user: res.locals.user,
    file: req.file,
    layout: "main",
  });
});

router.post(
  "/photos/upload",
  upload.array("photos", 12),
  function (req, res, next) {
    // req.files is array of `photos` files
    // req.body will contain the text fields, if there were any
  }
);

const cpUpload = upload.fields([
  { name: "avatar", maxCount: 1 },
  { name: "gallery", maxCount: 8 },
]);
router.post("/cool-profile", cpUpload, function (req, res, next) {
  // req.files is an object (String -> Array) where fieldname is the key, and the value is array of files
  //
  // e.g.
  //  req.files['avatar'][0] -> File
  //  req.files['gallery'] -> Array
  //
  // req.body will contain the text fields, if there were any
});

router.post("/scan", async (req, res, next) => {
  // Scan the file for malware using the Verisys Antivirus API - the same concepts can be
  // used to work with the uploaded file in different ways
  try {
    // Attach the uploaded file to a FormData instance
    var form = new FormData();
    form.append(
      "file",
      fs.createReadStream(uploadedFile.tempFilePath),
      uploadedFile.name
    );

    const headers = {
      "X-API-Key": "<YOUR API KEY HERE>",
      Accept: "*/*",
    };

    // Send the file to the Verisys Antivirus API
    const response = await fetch(
      "https://eu1.api.av.ionxsolutions.com/v1/malware/scan/file",
      {
        method: "POST",
        body: form,
        headers: headers,
      }
    );

    // Did we get a response from the API?
    if (response.ok) {
      const result = await response.json();

      // Did the file contain a virus/malware?
      if (result.status === "clean") {
        return res.send("Uploaded file is clean!");
      } else {
        return res
          .status(500)
          .send(`Uploaded file contained malware: <b>${result.signals[0]}</b>`);
      }
    } else {
      throw new Error("Unable to scan file: " + response.statusText);
    }
  } catch (error) {
    // Forward the error to the Express error handler
    return next(error);
  } finally {
    // Remove the uploaded temp file
    fs.rm(uploadedFile.tempFilePath, () => {});
  }
});

/** Set the app database. */
router.get("/setup", (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: "This is a test setup endpoint.",
      request: {
        user: req.user ?? null,
        cookies: req.cookies,
        signedCookies: req.signedCookies,
        query: req.query,
        params: req.params,
        body: req.body,
      },
    });
  } catch (error) {
    error.status = 500;
    next(error);
  }
});

export default router;
