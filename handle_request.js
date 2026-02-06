const inc = (value) => value + 1;
const dec = (value) => value - 1;

const getCounterHtmlTemplate = (value) => {
  return `<html>
  <body>
    <h1>Counter : ${value}</h1>
    <h3><a href="/counter/inc">INC</a>    <a href="/counter/dec">DEC</a></h3>
    <h3><a href="/">RESET</a></h3>
  </body>
</html>`;
};

const readFromJson = (path) => Deno.readTextFileSync(path);

const getValue = () => {
  const data = readFromJson("./counter.json");
  return JSON.parse(data);
};

const writeToJson = (counter) =>
  Deno.writeTextFileSync("./counter.json", JSON.stringify(counter));

const createResponse = (content, status) => {
  return new Response(content, {
    status,
    headers: {
      "content-type": "text/html",
    },
  });
};

const decrementHandler = () => {
  const counter = getValue();
  counter.value = dec(counter.value)
  writeToJson(counter);
  const body = getCounterHtmlTemplate(counter.value);

  return createResponse(body, 201);
};

const incrementHandler = () => {
  const counter = getValue();
  counter.value = inc(counter.value);
  writeToJson(counter);
  const body = getCounterHtmlTemplate(counter.value);
  return createResponse(body, 201);
};

const resetHandler = () => {
  const counter = { value: 0 };
  writeToJson(counter);
  const body = getCounterHtmlTemplate(counter.value);
  return createResponse(body, 200);
};

export const handleRequest = (request) => {
  const { pathname } = new URL(request.url);
  console.log(pathname);

  const handlerMapper = {
    "/": () => resetHandler(),
    "/counter/inc": () => incrementHandler(),
    "/counter/dec": () => decrementHandler(),
  };

  const handler = handlerMapper[pathname];
  const response = handler();

  return response;
};
