import FakeData from "./FakeData.js";
import {createImages} from "../../CreateImage.js"

FakeData.truncate("products");
FakeData.seedProducts();

createImages()
FakeData.truncate("images");
FakeData.seedImages();