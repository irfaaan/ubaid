import { Phone } from "@shared/schema";

/**
 * Format phone price with currency symbol
 */
export function formatPhonePrice(price: number): string {
  return `$${price.toLocaleString()}`;
}

/**
 * Calculate monthly payment for a phone
 * @param price The phone price
 * @param months Number of months for financing
 */
export function calculateMonthlyPayment(price: number, months: number = 24): string {
  const monthlyAmount = price / months;
  return `$${monthlyAmount.toFixed(2)}/mo`;
}

/**
 * Extract processor generation from processor string
 */
export function extractProcessorGeneration(processorString: string): number {
  const match = processorString.match(/Gen\s*(\d+)/i);
  return match ? parseInt(match[1]) : 0;
}

/**
 * Extract main camera megapixels from camera string
 */
export function extractMainCameraMp(cameraString: string): number {
  const match = cameraString.match(/(\d+)MP/);
  return match ? parseInt(match[1]) : 0;
}

/**
 * Extract battery capacity in mAh
 */
export function extractBatteryCapacity(batteryString: string): number {
  const match = batteryString.match(/(\d+)\s*mAh/);
  return match ? parseInt(match[1]) : 0;
}

/**
 * Compare two phones by a specific attribute
 * Returns the better phone for the given attribute
 */
export function comparePhoneAttribute(
  phone1: Phone,
  phone2: Phone,
  attribute: keyof Phone
): Phone | null {
  switch (attribute) {
    case "price":
      return phone1.price < phone2.price ? phone1 : phone2;
    case "processor":
      const gen1 = extractProcessorGeneration(phone1.processor);
      const gen2 = extractProcessorGeneration(phone2.processor);
      if (gen1 === 0 && gen2 === 0) return null;
      return gen1 > gen2 ? phone1 : gen2 > gen1 ? phone2 : null;
    case "mainCamera":
      const mp1 = extractMainCameraMp(phone1.mainCamera);
      const mp2 = extractMainCameraMp(phone2.mainCamera);
      if (mp1 === 0 && mp2 === 0) return null;
      return mp1 > mp2 ? phone1 : mp2 > mp1 ? phone2 : null;
    case "battery":
      const capacity1 = extractBatteryCapacity(phone1.battery);
      const capacity2 = extractBatteryCapacity(phone2.battery);
      if (capacity1 === 0 && capacity2 === 0) return null;
      return capacity1 > capacity2 ? phone1 : capacity2 > capacity1 ? phone2 : null;
    case "year":
      return phone1.year > phone2.year ? phone1 : phone2.year > phone1.year ? phone2 : null;
    default:
      return null;
  }
}

/**
 * Filter phones by price range
 */
export function filterPhonesByPriceRange(
  phones: Phone[],
  minPrice: number,
  maxPrice: number
): Phone[] {
  return phones.filter(
    (phone) => phone.price >= minPrice && phone.price <= maxPrice
  );
}

/**
 * Filter phones by series
 */
export function filterPhonesBySeries(
  phones: Phone[],
  series: string[]
): Phone[] {
  return phones.filter((phone) => series.includes(phone.series));
}

/**
 * Sort phones by attribute
 */
export function sortPhones(
  phones: Phone[],
  attribute: keyof Phone,
  ascending: boolean = true
): Phone[] {
  return [...phones].sort((a, b) => {
    let valueA, valueB;

    // Handle special cases
    switch (attribute) {
      case "price":
      case "year":
        valueA = a[attribute];
        valueB = b[attribute];
        break;
      case "processor":
        valueA = extractProcessorGeneration(a.processor);
        valueB = extractProcessorGeneration(b.processor);
        break;
      case "mainCamera":
        valueA = extractMainCameraMp(a.mainCamera);
        valueB = extractMainCameraMp(b.mainCamera);
        break;
      case "battery":
        valueA = extractBatteryCapacity(a.battery);
        valueB = extractBatteryCapacity(b.battery);
        break;
      default:
        valueA = String(a[attribute]).toLowerCase();
        valueB = String(b[attribute]).toLowerCase();
        break;
    }

    if (valueA < valueB) return ascending ? -1 : 1;
    if (valueA > valueB) return ascending ? 1 : -1;
    return 0;
  });
}
