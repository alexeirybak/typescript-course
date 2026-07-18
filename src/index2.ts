function printTitle(title: string | null | undefined): void {
  if (title === null || title === undefined) {
    console.log("Заголовок не найден");
    return;
  }

  console.log(title.toUpperCase());
}

printTitle("");

let count = 0;

if (count !== undefined || count !== null) {
  console.log(count);
}
