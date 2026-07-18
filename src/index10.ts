// type ProcessContext = {
//   userId: number;
//   locale: string;
//   requestId: string;
// };

// function process<TData, TUserId, TLocale, TRequestId>(
//   data: TData,
//   userId: TUserId,
//   locale: TLocale,
//   requestId: TRequestId,
// ): {
//   data: TData;
//   context: {
//     userId: TUserId;
//     locale: TLocale;
//     requestId: TRequestId;
//   };
// } {
//   return {
//     data,
//     context: {
//       userId,
//       locale,
//       requestId,
//     },
//   };
// }

// const result = process(
//   {
//     id: 1,
//     title: "Клавиатура",
//   },
//   15,
//   "ru",
//   "request-123",
// );

// console.log(result);

type ProcessContext = {
  userId: number;
  locale: string;
  requestId: string;
};

function process<TData>(
  data: TData,
  context: ProcessContext,
): {
  data: TData;
  context: ProcessContext;
} {
  return {
    data,
    context,
  };
}

const result = process(
  {
    id: 1,
    title: "Клавиатура",
  },
  {
    userId: 15,
    locale: "ru",
    requestId: "request-123",
  },
);

console.log(result);
