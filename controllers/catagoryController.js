import slugify from "slugify";
import catagoryModels from "../models/catagoryModels.js";

export const createCatagoryControoler= async (req,res) =>{
    
    try {
        const {name}= req.body;
        if(!name){
           return res.status(401).send({success:false, message:"The name is required"})
        }
        const existing= await catagoryModels.findOne({name:name});
        if(existing){
            return res.status(200).send({
                success:true,
                message:"The Catagory is exist"})
        }
        const catagory= await new catagoryModels({
            name,
            slug: slugify(name)
        }).save()
        res.status(201).send({
            success:true,
            message:" Catagery created successfully",
            catagory,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success:false,
            message:" Error in catagory",
            error,
        })
    }
}

export const updateCatagoryController = async(req,res) =>{
    
    try {
        const { name } = req.body;
    const { id } = req.params;
    const category = await catagoryModels.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    );
    res.status(200).send({
        success: true,
        messsage: "Category Updated Successfully",
        category,
      });
    } catch (error) {
        console.log(error);
            res.status(500).send({
            success: false,
            error,
            message: "Error while updating category",
        });
    }
}

// get all cat
export const getAllcategoryControlller = async (req, res) => {
    try {
      const category = await catagoryModels.find({});
      res.status(200).send({
        success: true,
        message: "All Categories List",
        category,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        error,
        message: "Error while getting all categories",
      });
    }
  };


  // single category
export const singleCategoryController = async (req, res) => {
    try {
      const category = await catagoryModels.findOne({ slug: req.params.slug });
      res.status(200).send({
        success: true,
        message: "Get SIngle Category SUccessfully",
        category,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        error,
        message: "Error While getting Single Category",
      });
    }
  };

  //delete category
export const deleteCategoryCOntroller = async (req, res) => {
    try {
      const { id } = req.params;
      await catagoryModels.findByIdAndDelete(id);
      res.status(200).send({
        success: true,
        message: "Categry Deleted Successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "error while deleting category",
        error,
      });
    }
  };
