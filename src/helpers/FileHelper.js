import axios from "axios";

export const FileHelper = {
  uploadFile,
  uploaderStats,
  getUploaders,
  getFilesForConsumers,
  getFilesForUploaders,
  getFile,
  deleteFile,
};

function uploadFile(file) {
  return axios.post(`${process.env.VUE_APP_APIROOT}/file`, file);
}

function uploaderStats(from, to) {
  return axios.get(
    `${process.env.VUE_APP_APIROOT}/file/uploadersStats/${from}/${to}`
  );
}

function getUploaders() {
  return axios.get(`${process.env.VUE_APP_APIROOT}/file/getMyUploaders`);
}

function getFilesForConsumers(uploader) {
  return axios.get(
    `${process.env.VUE_APP_APIROOT}/file/getFilesForConsumer/${uploader}`
  );
}

function getFilesForUploaders(consumer) {
  return axios.get(
    `${process.env.VUE_APP_APIROOT}/file/getFilesForUploader/${consumer}`
  );
}

function getFile(uploader, id) {
  const FileDownload = require("js-file-download");
  return axios
    .get(`${process.env.VUE_APP_APIROOT}/file/${uploader}/${id}`, {
      responseType: "arraybuffer",
      headers: {
        Accept: "application/octet-stream",
      },
    })
    .then((res) => {
      FileDownload(res.data, res.headers["content-disposition"].substring(21));
    });
}

function deleteFile(id) {
  return axios.delete(`${process.env.VUE_APP_APIROOT}/file/${id}`);
}
