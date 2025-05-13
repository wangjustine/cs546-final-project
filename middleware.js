// check if user is logged in
const isAuthenticated = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
};

// check if user is an admin
const isAdmin = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  if (req.session.user.category !== 'admin') {
    return res.status(403).render('error', {
      error: '403: Forbidden – Admin access only',
      link: '/user'
    });
  }

  next();
};

// prevent logged-in from accessing sign up
const redirectIfLoggedIn = (req, res, next) => {
  if (req.session.user) {
    if (req.session.user.category === 'admin') {
      return res.redirect('/admin');
    } else {
      return res.redirect('/dashboard');
    }
  }
  next();
};





let totalRequests = 0;
const pathsAccessed = {};

const requestLogger = (req, res, next) => {
  totalRequests++;
  const timestamp = new Date().toUTCString();
  const auth = req.session.user && req.session.user.category
    ? `Authenticated ${req.session.user.category.toUpperCase()}`
    : 'Non-Authenticated';

  console.log(`[${timestamp}]: ${req.method} ${req.path} (${auth})`);
  next();
};

const pathCounter = (req, res, next) => {
  if (!pathsAccessed[req.path]) pathsAccessed[req.path] = 0;
  pathsAccessed[req.path]++;
  console.log(
    `There have now been ${pathsAccessed[req.path]} requests made to ${req.path}`
  );
  next();
};

const oddEvenMarker = (req, res, next) => {
  if (totalRequests % 2 === 0) {
    req.isEven = true;
  } else {
    req.isOdd = true;
  }
  next();
};

const punSetter = (req, res, next) => {
  if (req.isEven) {
    req.pun = 'Someone is looking to get even.';
  } else if (req.isOdd) {
    req.pun = "This is an odd request that doesn't make me feel comfortable.";
  }
  next();
};

const punLogger = (req, res, next) => {
  if (req.pun) console.log(req.pun);
  next();
};

const blockAdmin = (req, res, next) => {
  if (req.path.startsWith('/admin')) {
    console.log("I'm in the admin middleware");
    return res.status(403).json({ error: '403: Forbidden' });
  }
  next();
};

const modifyPostsMethod = (req, res, next) => {
  if (req.path.startsWith('/posts') && req.method === 'GET') {
    req.method = 'PUT';
  }
  next();
};

const cookieTracker = (req, res, next) => {
  console.log('The request has all the following cookies:');
  console.log(req.cookies);
  if (req.cookies.lastAccessed) {
    console.log('Last accessed at ' + req.cookies.lastAccessed);
  } else {
    console.log('This user has never accessed the site before');
  }

  if (totalRequests % 5 === 0) {
    console.log('Clearing lastAccessed cookie');
    const anHourAgo = new Date();
    anHourAgo.setHours(anHourAgo.getHours() - 1);
    res.cookie('lastAccessed', '', { expires: anHourAgo });
    res.clearCookie('lastAccessed');
    return next();
  }

  const now = new Date();
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 1);

  res.cookie('lastAccessed', now.toString(), { expires: expiresAt });
  res.cookie('patrick', 'hill');
  next();
};

export {
  isAuthenticated,
  isAdmin,
  redirectIfLoggedIn,
  requestLogger,
  pathCounter,
  oddEvenMarker,
  punSetter,
  punLogger,
  blockAdmin,
  modifyPostsMethod,
  cookieTracker,
};
