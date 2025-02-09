const orderSchema =  {
  name: "order",
  title: "Order",
  type: "document",
  fields: [
    { name: "name", title: "Your Name", type: "string" },
    { name: "email", title: "Email", type: "string" },
    { name: "address", title: "Address", type: "string" },
    { name: "mobile", title: "Mobile Number", type: "string" },
    {
      name: "province",
      title: "Province",
      type: "string",
      options: {
        list: [
          { title: "Sindh", value: "sindh" },
          { title: "Punjab", value: "punjab" },
        ],
        layout: "dropdown",
      },
    },
    { name: "city", title: "City", type: "string" },
    { name: "zipCode", title: "Zip Code", type: "string" },

    {
      name: "cartItems",
      title: "Cart Items",
      type: "array",
      of: [{ type: "reference", to: { type: "product" } }],
    },
    {
      name: "total",
      title: "Total",
      type: "number",
    },
    {
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Delivered", value: "delivered" },
        ],
        layout: "radio",
      },
      InitialValue: "Pending",
    },
  ],
};
export default orderSchema;



