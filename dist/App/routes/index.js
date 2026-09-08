"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_router_1 = require("../modules/Auth/auth.router");
const category_route_1 = require("../modules/Category/category.route");
const subCategory_route_1 = require("../modules/SubCategory/subCategory.route");
const employee_route_1 = require("../modules/Employee/employee.route");
const party_route_1 = require("../modules/Party/party.route");
const AccountsItem_route_1 = require("../modules/AccountsItem/AccountsItem.route");
const piller_route_1 = require("../modules/Pilliers/piller.route");
const unit_route_1 = require("../modules/unit/unit.route");
const product_route_1 = require("../modules/products/product.route");
const inventories_route_1 = require("../modules/inventories/inventories.route");
const raw_route_1 = require("../modules/rawMaterials/raw.route");
const journal_route_1 = require("../modules/journal/journal.route");
const bank_route_1 = require("../modules/bank/bank.route");
const transaction_route_1 = require("../modules/bankTransaction/transaction.route");
const createProduct_route_1 = require("../modules/createProduce/createProduct.route");
const report_route_1 = require("../modules/Reports/report.route");
const transction_route_1 = require("../modules/TransctionVoucher/transction.route");
const user_route_1 = require("../modules/User/user.route");
const production_route_1 = require("../modules/Production/production.route");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/auth",
        route: auth_router_1.AuthRoutes,
    },
    {
        path: "/category",
        route: category_route_1.CategoryRouter,
    },
    {
        path: "/sub-category",
        route: subCategory_route_1.SubCategoryRouter,
    },
    {
        path: "/accounts_head",
        route: piller_route_1.AccountsHeadRoute,
    },
    {
        path: "/employee",
        route: employee_route_1.EmployeeRoute,
    },
    {
        path: "/user",
        route: user_route_1.UserRoute,
    },
    {
        path: "/party",
        route: party_route_1.PartyRoute,
    },
    {
        path: "/accounts_item",
        route: AccountsItem_route_1.AccountItemRoute,
    },
    {
        path: "/unit",
        route: unit_route_1.UnitRoute,
    },
    {
        path: "/product",
        route: product_route_1.ProductRoute,
    },
    {
        path: "/raw_material",
        route: raw_route_1.RawMaterialRoute,
    },
    {
        path: "/inventory",
        route: inventories_route_1.InventoryRoute,
    },
    {
        path: "/journal",
        route: journal_route_1.JournalRoute,
    },
    {
        path: "/bank",
        route: bank_route_1.BankRoute,
    },
    {
        path: "/transaction",
        route: transaction_route_1.TransactionRoute,
    },
    {
        path: "/create-product",
        route: createProduct_route_1.createProductRoute,
    },
    {
        path: "/report",
        route: report_route_1.ReportRouter,
    },
    {
        path: "/voucher",
        route: transction_route_1.VoucherRoute,
    },
    {
        path: "/user",
        route: user_route_1.UserRoute,
    },
    {
        path: "/production",
        route: production_route_1.ProductionRouter,
    }
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
