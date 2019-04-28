export function debug(message: string = "") {
    // var stack = new Error().stack || "",
    // caller = stack.split("\n")[2].trim();
    console.log(/*caller,*/ message);
}
