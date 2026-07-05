import { vegitablesListRouter } from "./../modules/vegitablesList/vegitablesList.route";
import { Router } from "express";
// import { authRouter } from "../modules/auth/auth.routes";

import { hallTypeRouter } from "../modules/hallType/hallType.routes";
import { functionTypeRouter } from "../modules/functionType/functionType.routes";
import { termsConditionsRouter } from "../modules/termsConditions/termsConditions.routes";
import { buffetNameRouter } from "../modules/buffetName/buffetName.route";
import { menuCategoryRouter } from "../modules/menuCategory/menucategory.routes";
import { chatMenuRouter } from "../modules/chatMenu/chatMenu.route";
import { crockeryListRouter } from "../modules/crockeryList/crockeryList.route";
import { grosaryListRouter } from "../modules/grosaryList/grosaryList.route";
import { otherListRouter } from "../modules/otherList/otherList.route";
import { startersCategoryRouter } from "../modules/startersCategory/startersCategory.routes";
import { startersMenuRouter } from "../modules/startersMenu/startersMenu.routes";
import { sweetMenuRouter } from "../modules/sweetMenu/sweetMenu.route";
import { otherMenuRouter } from "../modules/otherMenu/otherMenu.route";
import { menuListRouter } from "../modules/menuList/menuList.route";
import { enquiryRouter } from "../modules/allEnquiry/enquiry.route";
import { externalItemsRouter } from "../modules/externalItems/externalItems.routes";
import { bookingRouter } from "../modules/bookings/booking.routes";
import { authRouter } from "../modules/auth/auth.routes";
import { gstRouter } from "../modules/gst/gst.routes";
import { invoiceRouter } from "../modules/invoice/invoice.routes";
import { chatCategoryRouter } from "../modules/chatCategory/chat.routes";
const router = Router();
const moduleRoutes = [
  {
    path: "/auth",
    route: authRouter,
  },

  {
    path: "/enquiry",
    route: enquiryRouter,
  },
  {
    path: "/terms-conditions",
    route: termsConditionsRouter,
  },
  {
    path: "/function-type",
    route: functionTypeRouter,
  },
  {
    path: "/hall-type",
    route: hallTypeRouter,
  },
  {
    path: "/buffet-name",
    route: buffetNameRouter,
  },
  {
    path: "/menu-category",
    route: menuCategoryRouter,
  },
  {
    path: "/menu-list",
    route: menuListRouter,
  },
  {
    path: "/chat-menu",
    route: chatMenuRouter,
  },
  {
    path: "/crockery-list",
    route: crockeryListRouter,
  },
  {
    path: "/grocery-list",
    route: grosaryListRouter,
  },
  {
    path: "/vegitables-list",
    route: vegitablesListRouter,
  },
  {
    path: "/other-list",
    route: otherListRouter,
  },
  {
    path: "/startes-menu-category",
    route: startersCategoryRouter,
  },
  {
    path: "/startes-menu",
    route: startersMenuRouter,
  },
  {
    path: "/sweet-menu",
    route: sweetMenuRouter,
  },
  {
    path: "/other-menu",
    route: otherMenuRouter,
  },
  {
    path: "/external-list",
    route: externalItemsRouter,
  },
  {
    path: "/booking",
    route: bookingRouter,
  },
  {
    path: "/gst",
    route: gstRouter,
  },
  {
    path: "/invoice",
    route: invoiceRouter,
  },
  {
    path: "/chat-menu-category",
    route: chatCategoryRouter,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
