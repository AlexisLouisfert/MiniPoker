import { createApp } from "./createApp";
//import { createApp } from "../src/createApp";

const app = createApp()

app.listen(3000, () => console.log("Server is running on port 3000"));