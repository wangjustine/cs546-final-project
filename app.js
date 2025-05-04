import express from "express";
import session from "express-session";
import exphbs from "express-handlebars";
import { dbConnection } from "./config/mongoConnections.js"; 
import userRoutes from "./routes/users.js";
import taskRoutes from "./routes/tasks.js";
import homeRoutes from "./routes/index.js"; 
import boardRoutes from "./routes/boards.js"; 
import commentRoutes from "./routes/comments.js"; 
import notificationRoutes from "./routes/notifications.js"; 

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: "taskflow_secret",
  resave: false,
  saveUninitialized: false,
}));

app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.use(express.static("public"));


app.use("/", homeRoutes);
app.use("/users", userRoutes);
app.use("/tasks", taskRoutes);
app.use("/boards", boardRoutes);
app.use("/comments", commentRoutes);
app.use("/notifications", notificationRoutes);


const startServer = async () => {
  try {
    await dbConnection();
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (e) {
    console.error("Failed to connect to MongoDB:", e);
  }
};

startServer();
