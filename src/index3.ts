function compare(left: string | number, right: string | boolean): boolean {
  if (left === right) {
    return left.toLowerCase() === right.toLowerCase();
  }

  return false;
}

console.log(compare(10, "10"));
