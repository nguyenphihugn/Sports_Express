import { v4 as uuidv4 } from "uuid";
import axios from "axios";
export const uploadFileToS3 = async (file) => {
  const list = {
    key: `${uuidv4()}.${file.type.split("/")[1]}`,
  };

  console.log(file, list.key);

  try {
    // const data = await axios.post(`/api/presign-url-upload`, {
    //   params: {
    //     key: params.key,
    //   },
    // });
    const res = await axios.get(`/api/presign-url-upload`, {
      params: {
        key: list.key,
      },
    });
    return { key: list.key, presign: res.data.url };
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw error;
  }
};
