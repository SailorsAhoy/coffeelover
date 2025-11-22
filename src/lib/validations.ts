import { z } from "zod";

export const productSchema = z.object({
  productName: z.string().trim().min(1, "Product name is required").max(200, "Product name must be less than 200 characters"),
  roasterName: z.string().trim().max(200, "Roaster name must be less than 200 characters").optional(),
  roasterCountry: z.string().trim().max(100, "Country must be less than 100 characters").optional(),
  productUrl: z.string().trim().url("Invalid URL").optional().or(z.literal("")),
  priceAmount: z.string().refine((val) => !val || (!isNaN(Number(val)) && Number(val) > 0 && Number(val) <= 10000), {
    message: "Price must be a positive number up to 10,000"
  }).optional(),
  weightGrams: z.string().refine((val) => !val || (!isNaN(Number(val)) && Number(val) > 0 && Number(val) <= 5000), {
    message: "Weight must be a positive number up to 5,000 grams"
  }).optional(),
  roastDate: z.string().optional(),
  isDecaf: z.boolean().optional(),
  countryOfOrigin: z.string().trim().max(100, "Country must be less than 100 characters").optional(),
  region: z.string().trim().max(200, "Region must be less than 200 characters").optional(),
  producerName: z.string().trim().max(200, "Producer name must be less than 200 characters").optional(),
  farmName: z.string().trim().max(200, "Farm name must be less than 200 characters").optional(),
  altitudeMeters: z.string().refine((val) => !val || (!isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 5000), {
    message: "Altitude must be between 0 and 5,000 meters"
  }).optional(),
  processingMethod: z.string().trim().max(100, "Processing method must be less than 100 characters").optional(),
  varietals: z.string().trim().max(500, "Varietals must be less than 500 characters").optional(),
  flavorProfile: z.string().trim().max(500, "Flavor profile must be less than 500 characters").optional(),
  cuppingScore: z.string().refine((val) => !val || (!isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 100), {
    message: "Cupping score must be between 0 and 100"
  }).optional(),
  harvestDate: z.string().optional(),
  lotNumber: z.string().trim().max(100, "Lot number must be less than 100 characters").optional(),
  washStation: z.string().trim().max(200, "Wash station must be less than 200 characters").optional(),
  notes: z.string().trim().max(2000, "Notes must be less than 2,000 characters").optional()
});

export const brewSchema = z.object({
  brewMethod: z.enum(["espresso", "pour_over", "french_press", "aeropress", "cold_brew", "moka_pot", "drip"]),
  grindSetting: z.string().trim().max(100, "Grind setting must be less than 100 characters").optional(),
  coffeeDoseGrams: z.string().refine((val) => !val || (!isNaN(Number(val)) && Number(val) > 0 && Number(val) <= 500), {
    message: "Coffee dose must be between 0 and 500 grams"
  }).optional(),
  waterAmountGrams: z.string().refine((val) => !val || (!isNaN(Number(val)) && Number(val) > 0 && Number(val) <= 5000), {
    message: "Water amount must be between 0 and 5,000 grams"
  }).optional(),
  waterTempCelsius: z.string().refine((val) => !val || (!isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 100), {
    message: "Temperature must be between 0 and 100°C"
  }).optional(),
  brewWeightGrams: z.string().refine((val) => !val || (!isNaN(Number(val)) && Number(val) > 0 && Number(val) <= 5000), {
    message: "Brew weight must be between 0 and 5,000 grams"
  }).optional(),
  tdsPercentage: z.string().refine((val) => !val || (!isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 30), {
    message: "TDS must be between 0 and 30%"
  }).optional(),
  extractionTimeSeconds: z.string().refine((val) => !val || (!isNaN(Number(val)) && Number(val) > 0 && Number(val) <= 3600), {
    message: "Extraction time must be between 0 and 3,600 seconds"
  }).optional(),
  coffeeToWaterRatio: z.string().trim().max(20, "Ratio must be less than 20 characters").optional(),
  coffeeToBrewRatio: z.string().trim().max(20, "Ratio must be less than 20 characters").optional(),
  extractionYieldPercentage: z.string().refine((val) => !val || (!isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 100), {
    message: "Yield must be between 0 and 100%"
  }).optional(),
  aromaScore: z.number().min(0).max(10).optional(),
  sweetnessScore: z.number().min(0).max(10).optional(),
  acidityScore: z.number().min(0).max(10).optional(),
  bitternessScore: z.number().min(0).max(10).optional(),
  bodyScore: z.number().min(0).max(10).optional(),
  flavorProfileAccuracy: z.string().trim().max(500, "Accuracy note must be less than 500 characters").optional(),
  overallRating: z.number().min(0).max(10).optional(),
  notes: z.string().trim().max(2000, "Notes must be less than 2,000 characters").optional()
});

export type ProductFormData = z.infer<typeof productSchema>;
export type BrewFormData = z.infer<typeof brewSchema>;
