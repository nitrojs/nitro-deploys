import { readFormData } from "nitro/h3";
import { defineTestHandler } from "../../utils/test";

// https://github.com/nitrojs/nitro/issues/1721
export default defineTestHandler(
  "form-data",
  async (event) => {
    const formData = await readFormData(event);
    return {
      data: Object.fromEntries(formData),
    };
  },
  async ({ assert }) => {
    const formData = new FormData();
    formData.append("name", "John Doe");
    const res = await fetch("", { method: "POST", body: formData }).then(
      (res) => res.json(),
    );
    assert(res.data.name === "John Doe", `Unexpected response: ${res.data}`);
  },
);
