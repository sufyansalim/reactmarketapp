import React from "react";
import axios from "axios";
import baseUrl from "../utils/baseUrl";
import catchErrors from "../utils/catchErrors";
import {
  Form,
  Input,
  TextArea,
  Button,
  Image,
  Message,
  Header,
  Icon
} from "semantic-ui-react";

const INITIAL_PRODUCT = {
  name: "",
  price: "",
  media: "",
  description: ""
};

function CreateProduct() {
  const [product, setProduct] = React.useState(INITIAL_PRODUCT);
  const [mediaPreview, setMediaPreview] = React.useState("");
  const [success, setSuccess] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [disabled, setDisabled] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    const isProduct = Object.values(product).every(el=>Boolean(el))
    isProduct ? setDisabled(false) : setDisabled(true);
  },[product])

  function handleChange(event) {
    const { name, value, files } = event.target;
    if (name === "media") {
      setProduct(prevState => ({ ...prevState, media: files[0] }));
      setMediaPreview(window.URL.createObjectURL(files[0]));
    } else {
      setProduct(prevState => ({ ...prevState, [name]: value }));
    }
  }

  async function handleImageUpload() {
    const data = new FormData();
    data.append("file", product.media);
    data.append("upload_preset", "reactmarket");
    data.append("cloud_name", "sufi055");
    const response = await axios.post(process.env.CLOUDINARY_URL, data);
    const mediaUrl = response.data.url;
    return mediaUrl;
  }

  async function handleSubmit(event) {
    try{
      event.preventDefault();
    setLoading(true);
    setError('')
    const mediaUrl = await handleImageUpload();
    // console.log({ mediaUrl });
    const url = `${baseUrl}/api/product`;
    const { name, price, description } = product;
    const payload = { name, price, description, mediaUrl };
    const response = await axios.post(url, payload);
    // console.log({ response });
    setLoading(false);
    setProduct(INITIAL_PRODUCT);
    setSuccess(true);
    }catch(error){
      catchErrors(error,setError)
    }finally{
      setLoading(false);
    }
    
  }

  return (
    <>
      <Header as="h2" block>
        <Icon name="add" color="orange" />
        Create New Product
      </Header>
      <Form loading={loading} success={success} error={Boolean(error)} onSubmit={handleSubmit}>
      <Message
          error
          header="Oops!"
          content={error}
        />
        <Message
          success
          icon="check"
          header="Success!"
          content="Your product has been posted"
        />
        <Form.Group widths="equal">
          <Form.Field
            control={Input}
            name="name"
            label="Name"
            placeholer="Name"
            value={product.name}
            onChange={handleChange}
          />
          <Form.Field
            control={Input}
            name="price"
            label="Price"
            placeholer="Price"
            min="0.0"
            step="0.01"
            type="number"
            value={product.price}
            onChange={handleChange}
          />
          <Form.Field
            control={Input}
            name="media"
            label="Media"
            type="file"
            content="Select Image"
            accept="image/*"
            onChange={handleChange}
          />
        </Form.Group>
        <Image src={mediaPreview} rounded centered size="small" />
        <Form.Field
          control={TextArea}
          name="description"
          label="Description"
          placeholer="Description"
          value={product.description}
          onChange={handleChange}
        />
        <Form.Field
          disabled={disabled || loading}
          control={Button}
          color="blue"
          icon="pencil alternate"
          content="Submit"
          type="submit"
        />
      </Form>
    </>
  );
}

export default CreateProduct;
