import { defineTestHandler } from "../../utils/test";

// https://github.com/nitrojs/nitro/issues/1721
export default defineTestHandler(
  "multipart-form-data",
  async (event) => {
    const formData = await event.req.formData();
    const name = formData.get("name") as string;
    const file = formData.get("file") as File;

    return {
      data: {
        name,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      },
    };
  },
  async ({ assert }) => {
    const formData = new FormData();
    formData.append("name", "John Doe");

    const rawFile = await fetch("/data.pdf").then((res) => res.arrayBuffer());

    const file = new Blob([rawFile], { type: "application/pdf" });
    formData.append("file", file, "data.pdf");

    const res = await fetch("", { method: "POST", body: formData }).then(
      (res) => res.json(),
    );
    assert(res.data.name === "John Doe", `Unexpected response: ${res.data}`);
    assert(
      res.data.fileSize === rawFile.byteLength,
      `Unexpected response: ${res.data}`,
    );
  },
);
