export interface IOrderCreation {
  customerName: string;
  customerMobile: string;
  totalPrice: number;
  orderItems: { itemID: string; quantity: number }[];
}

export interface IOrderUpdate extends IOrderCreation {}

export interface IOrderList {
  page?: number;
  pageSize?: number;
}

export interface IOrderDailyReport {
  day?: Date;
  timezoneOffset: number;
}
