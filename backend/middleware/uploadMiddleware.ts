import multer, { FileFilterCallback } from "multer"
import { Request } from "express"
import path from "node:path"

// storage config 
const storage = multer.diskStorage({
    destination:function(req:Request,file:Express.Multer.File,cb:(error:Error | null ,destination:string) => void){
        cb(null,"uploads/")
    },
    filename:function(
        req:Request,
        file:Express.Multer.File,
        cb:(error:Error | null , filename:string) => void ) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() *1e9 )
        const ext = path.extname(file.originalname)
        cb(null,`${file.fieldname}-${uniqueSuffix}${ext}`)
    }
})

// file filter (only images)


const fileFilter = (req:Request,file:Express.Multer.File,cb:FileFilterCallback) => {
    if(file.mimetype.startsWith("image/")){
        cb(null,true)
    }else {
        cb(new Error("onyl img files are allowed"))
    }
}

//multer upload instance

const upload = multer({
    storage,fileFilter,limits:{fileSize:5*1024*1024} //5MB max
})


export default upload