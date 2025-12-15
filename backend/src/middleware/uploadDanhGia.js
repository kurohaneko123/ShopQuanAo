import multer from "multer";

const storage = multer.memoryStorage();

const uploadDanhGia = multer({
    storage,
    limits: {
        files: 5 // tối đa 5 ảnh
    }
});

export default uploadDanhGia;
