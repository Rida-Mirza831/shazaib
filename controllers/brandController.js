import Brand from "../models/brand.js";

export const getAllBrands = async (req, res) => {
  try {
    let { page = 1, limit = 20 } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const skip = (page - 1) * limit;

    const brands = await Brand.find().skip(skip).limit(limit);
    const totalBrands = await Brand.countDocuments();

    res.json({
      total: totalBrands,
      page,
      limit,
      totalPages: Math.ceil(totalBrands / limit),
      data: brands
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getBrandById = async (req, res) => {
  try {
    const brand = await Brand.findOne({ brand_id: req.params.id });
    if (!brand) return res.status(404).json({ message: "Brand not found" });

    res.json(brand);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getBrandWheels = async (req, res) => {
  try {
    const brand = await Brand.findOne({ brand_id: req.params.id });
    if (!brand) return res.status(404).json({ message: "Brand not found" });

    let { page = 1, limit = 20 } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const start = (page - 1) * limit;
    const end = start + limit;

    const wheels = brand.wheels.slice(start, end);

    res.json({
      total: brand.wheels.length,
      page,
      limit,
      totalPages: Math.ceil(brand.wheels.length / limit),
      data: wheels
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getWheelById = async (req, res) => {
  try {
    const brand = await Brand.findOne({ "wheels.id": req.params.wheelId });
    if (!brand) return res.status(404).json({ message: "Wheel not found" });

    const wheel = brand.wheels.find(w => w.id === req.params.wheelId);
    res.json(wheel);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};





