import QRCode from 'qrcode';

export const generateQR = async (data) => {
  try {
    return await QRCode.toDataURL(data);
  } catch (err) {
    console.log(err);
  }
};