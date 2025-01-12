import { render, screen } from "@testing-library/react";
import Products from "./products";
import { DiscountType } from "../external/product";

const mockProducts = [
  {
    id: 1,
    name: "Face Masks",
    price: 2.5,
    unit: null,
    image: "https://picsum.photos/200",
    discountType: "buyXForPriceY" as DiscountType,
    discountValue: {
      x: 2,
      y: 4,
    },
  },
  {
    id: 2,
    name: "Toilet Paper",
    price: 0.65,
    unit: "roll",
    image: "https://picsum.photos/200",
    discountType: "buyXGetYFree" as DiscountType,
    discountValue: {
      x: 6,
      y: 2,
    },
  },
];

test("render shopping cart correctly", () => {
  render(<Products products={mockProducts} />);
  screen.getByTestId("products");
});

test("show product item correctly", () => {
  render(<Products products={mockProducts} />);
  // get product item with product ID = 1 (i.e. Face Masks)
  const faceMaskItem = screen.getByTestId("product-1");
  expect(faceMaskItem).toBeInTheDocument();
});

test("show product item name correctly", () => {
  render(<Products products={mockProducts} />);
  // get product item with product ID = 1 (i.e. Face Masks)
  const faceMaskItem = screen.getByTestId("product-name-1");
  expect(faceMaskItem).toHaveTextContent("Face Masks");
});

test("show product item price correctly", () => {
  render(<Products products={mockProducts} />);
  // get product item with product ID = 1 (i.e. Face Masks)
  const faceMaskItem = screen.getByTestId("product-price-1");
  expect(faceMaskItem).toHaveTextContent("£2.50");
});

// test("click add to cart button trigger function correctly", () => {
//   const mockFn = jest.fn();
//   const view = render(
//     <Products products={mockProducts}  />
//   );
//   view.getByTestId("add-button-1").click();
//   expect(mockFn).toHaveBeenCalledTimes(1);
// });
