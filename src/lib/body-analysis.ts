import type { SizeProfile } from "@/types/user";

export interface BodyAnalysisResult {
  shape: string;
  sizeCategory: string;
  fitSuggestions: string[];
  avatarType: string;
}

/**
 * Analyzes body measurements and returns shape/size category.
 *
 * TODO: Replace this mock analysis with a real CV/AI body-scan model.
 * Integration point: POST measurements to a body-analysis microservice
 * (e.g., a Python FastAPI service wrapping a pose-estimation model)
 * and parse the response here.
 */
export function analyzeBody(measurements: SizeProfile): BodyAnalysisResult {
  const { chest, waist, hips, height, weight } = measurements;

  let shape = "rectangle";
  let avatarType = "rectangle";

  if (chest && waist && hips) {
    const bustHipDiff = Math.abs(chest - hips);
    const waistBustRatio = waist / chest;
    const waistHipRatio = waist / hips;

    if (bustHipDiff <= 5 && waistBustRatio < 0.75) {
      shape = "hourglass";
      avatarType = "hourglass";
    } else if (hips > chest + 5 && waistHipRatio < 0.8) {
      shape = "pear";
      avatarType = "pear";
    } else if (chest > hips + 5) {
      shape = "inverted-triangle";
      avatarType = "inverted-triangle";
    } else if (waist > chest - 5 && waist > hips - 5) {
      shape = "apple";
      avatarType = "apple";
    } else {
      shape = "rectangle";
      avatarType = "rectangle";
    }
  }

  // Derive size from chest measurement or default to M
  let sizeCategory = "M";
  if (chest) {
    if (chest < 80) sizeCategory = "XS";
    else if (chest < 88) sizeCategory = "S";
    else if (chest < 96) sizeCategory = "M";
    else if (chest < 104) sizeCategory = "L";
    else if (chest < 112) sizeCategory = "XL";
    else sizeCategory = "XXL";
  } else if (height && weight) {
    const bmi = weight / Math.pow(height / 100, 2);
    if (bmi < 18.5) sizeCategory = "XS";
    else if (bmi < 22) sizeCategory = "S";
    else if (bmi < 25) sizeCategory = "M";
    else if (bmi < 28) sizeCategory = "L";
    else sizeCategory = "XL";
  }

  const fitSuggestions = getFitSuggestions(shape, sizeCategory);

  return { shape, sizeCategory, fitSuggestions, avatarType };
}

function getFitSuggestions(shape: string, _size: string): string[] {
  const suggestions: Record<string, string[]> = {
    hourglass: [
      "Wrap dresses and fitted silhouettes flatter your balanced proportions",
      "High-waisted bottoms emphasise your natural waist",
      "Fitted blazers and bodycon styles work beautifully",
      "Avoid boxy or shapeless cuts that hide your curves",
    ],
    pear: [
      "A-line and flared skirts balance hip-to-shoulder ratio",
      "Structured tops and off-shoulder styles draw attention upward",
      "Dark colours on the bottom create a slimming effect",
      "Wide-leg trousers create a balanced silhouette",
    ],
    "inverted-triangle": [
      "V-necks and scoop necks soften broader shoulders",
      "Flared skirts and wide-leg pants add volume below the waist",
      "Avoid heavy shoulder details — opt for simple necklines",
      "Wrap tops and peplum styles work great for you",
    ],
    apple: [
      "Empire-waist and flowy tops skim the midsection",
      "V-necks elongate the torso beautifully",
      "Straight-leg and bootcut pants create a balanced look",
      "Avoid clingy fabrics around the midsection",
    ],
    rectangle: [
      "Create curves with belted waists and peplum tops",
      "Ruffles, prints, and textures add dimension",
      "High-waisted bottoms with tucked-in tops define your waist",
      "Layering works well — try blazers over fitted tops",
    ],
  };

  return suggestions[shape] ?? suggestions.rectangle;
}
