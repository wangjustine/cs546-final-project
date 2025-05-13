import express from "express";
import session from "express-session";
import exphbs from "express-handlebars";
import cookieParser from 'cookie-parser';
import { dbConnection } from "./config/mongoConnections.js"; 
import userRoutes from "./routes/users.js";
import taskRoutes from "./routes/tasks.js";
import homeRoutes from "./routes/index.js"; 
import boardRoutes from "./routes/boards.js"; 
import commentRoutes from "./routes/comments.js"; 
import notificationRoutes from "./routes/notifications.js"; 
import adminRoutes from './routes/admin.js';

import {
  isAuthenticated,
  isAdmin,
  redirectIfLoggedIn,
  requestLogger,
  pathCounter,
  oddEvenMarker,
  punSetter,
  punLogger,
  cookieTracker
} from './middleware.js';


const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: "taskflow_secret",
  resave: false,
  saveUninitialized: false,
}));



app.use(cookieParser());

app.use(requestLogger);
app.use(pathCounter);
app.use(oddEvenMarker);
app.use(punSetter);
app.use(punLogger);
app.use(cookieTracker);
//app.use(blockAdmin);          //  block /admin routes globally
//app.use(modifyPostsMethod);   // mutate method for /posts
app.use(cookieTracker);






const hbs = exphbs.create({
  defaultLayout: 'main',
  helpers: {
    eq: (a, b) => a === b
  }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.use(express.static("public"));

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});
app.use("/", homeRoutes);
app.use("/users", userRoutes);
app.use("/tasks", taskRoutes);
app.use("/boards", boardRoutes);
app.use("/comments", commentRoutes);
app.use("/notifications", notificationRoutes);
app.use('/admin', adminRoutes);


const startServer = async () => {
  try {
    await dbConnection();
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (e) {
    console.error("Failed to connect to MongoDB:", e);
  }
};

startServer();
