const express = require('express');
const bodyParser = require('body-parser');
import { filterImageFromURL, deleteLocalFiles } from './util/util';

(async () => {

  // Init the Express applicationF
  const app = express();
  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  const IMAGE_URL_IS_NOT_NULL = "image url is not null"
  const IMAGE_URL_IS_INVALID = "image url is invalid"
  const SUCCESS_HTTP_STATUS = 200
  const BAD_REQUEST_HTTP_STATUS = 400

  //image url is invalid
  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1

  app.get("/filteredimage", async (req: any, res: any) => {
    const image_url = req.query.image_url;
    const isValidUrl:any = image_url.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    if (!image_url) {
      res.status(BAD_REQUEST_HTTP_STATUS).send(IMAGE_URL_IS_NOT_NULL);
    } else if (isValidUrl == null) {
      res.status(BAD_REQUEST_HTTP_STATUS).send(IMAGE_URL_IS_INVALID);
    } else {
      const filteredpath = await filterImageFromURL(image_url.toString());
      res.status(SUCCESS_HTTP_STATUS).sendFile(filteredpath, () => {
        deleteLocalFiles([filteredpath]);
      });
    }
  });
  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req: any, res: any) => {
    res.send("try GET /filteredimage?image_url={{}}")
  });


  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();