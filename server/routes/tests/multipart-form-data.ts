// https://github.com/nitrojs/nitro/issues/1721
export default defineTestHandler(
  "multipart-form-data",
  async (event) => {
    const formData = await readMultipartFormData(event);
    const name = formData
      .find((partData) => partData.name === "name")
      ?.data.toString();
    const rawFile = formData.find((partData) => partData.name === "file");

    return {
      data: {
        name,
        fileName: rawFile.filename,
        fileType: rawFile.type,
        fileSize: rawFile.data.byteLength,
      },
    };
  },
  async (assert) => {
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
