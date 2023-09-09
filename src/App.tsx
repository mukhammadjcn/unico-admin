import { Button, Divider, Form, Input, Modal, Select, Upload } from 'antd';
import { useEffect, useState } from 'react';
import { UploadOutlined, PlusCircleOutlined } from '@ant-design/icons';
import {
  AddShowroomConfig,
  EditShowroom,
  GetProductsConfig,
  GetShowroomConfig,
  getShopsConfig,
} from './service/api';
import { OptionProps } from 'antd/es/mentions';
import { useSearchParams } from 'react-router-dom';
import { Ishop } from './type';
import './main.css';

function App() {
  const [form] = Form.useForm();
  const [searchParams, setSearchParams] = useSearchParams();
  const [preview, setPreview] = useState<string>();
  const [selectedFile, setSelectedFile] = useState();
  const [shops, setShops] = useState<OptionProps[]>([]);
  const [coor, setCoors] = useState<{ x: number; y: number }>();
  const [coorList, setCoorsList] = useState<{ x: number; y: number }[]>([]);
  const [shop] = useState(searchParams.get('shop'));
  const [banner, setBanner] = useState<any>({});
  const [products, setProducts] = useState<any>([]);
  const [isModalOpen, setModalOpen] = useState(false);

  const handleMakeParams = (key: any, value: any) => {
    if (value) {
      if (searchParams.has(key)) searchParams.set(key, value);
      else searchParams.append(key, value);
    } else searchParams.delete(key);
    setSearchParams(searchParams);
  };
  const getShops = () => {
    getShopsConfig().then(({ data }) =>
      setShops(
        data?.results?.reduce(
          (all: OptionProps[], current: Ishop) => [
            ...all,
            { value: current.id, label: current.name },
          ],
          []
        )
      )
    );
  };
  const getBanner = () => {
    searchParams.get('bannerId') &&
      GetShowroomConfig(searchParams.get('bannerId')).then(({ data }) => {
        setBanner(data);
      });
  };
  const getProducts = async (id?: number) => {
    const { data } = await GetProductsConfig(searchParams.get('shop') || id);
    setProducts(
      data?.results.reduce(
        (all: any, current: any) => [
          ...all,
          {
            value: current?.id,
            label: (
              <div className="customOption">
                <img
                  src={'https://api.livein.uz' + current?.images[0]}
                  alt=""
                />
                <h2>{current?.name}</h2>
              </div>
            ),
          },
        ],
        []
      )
    );
  };
  useEffect(() => {
    getShops();
    getBanner();
    getProducts();
  }, []);

  // create a preview as a side effect, whenever selected file is changed
  const onSelectFile = (file: any) => {
    const formData = new FormData();
    formData.append('banner', file);
    formData.append('shop', searchParams.get('shop') || '');
    formData.append(
      'products',
      JSON.stringify([
        {
          x: 0,
          y: 0,
          product: 30,
        },
      ])
    );

    // Preview image
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    AddShowroomConfig(formData).then((res) => {
      handleMakeParams('bannerId', res.data?.id);
      setBanner(res.data);
    });
  };

  // Send products to apis
  const SendProductBanner = async (val: any) => {
    const olderProducts = banner?.products?.reduce(
      (all: any, current: any) => [
        ...all,
        {
          x: current?.x,
          y: current?.y,
          product: current?.product?.id,
        },
      ],
      []
    );
    await EditShowroom(searchParams.get('bannerId'), {
      products: [...olderProducts, val],
    });
    getBanner();
  };

  return (
    <div className="home">
      <div
        style={{
          gap: 16,
          marginTop: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Upload
          beforeUpload={onSelectFile}
          showUploadList={false}
          accept="image/*"
        >
          <Button
            type="primary"
            icon={<UploadOutlined />}
            disabled={!searchParams.get('shop')}
          >
            Asosiy rasmni yuklash
          </Button>
        </Upload>

        <Select
          allowClear
          options={shops}
          style={{ width: 200 }}
          defaultValue={shop && Number(shop)}
          placeholder="Select the shop"
          onChange={(id) => {
            handleMakeParams('shop', id);
            id && getProducts(id);
          }}
        />
      </div>
      <div
        style={{
          gap: 24,
          marginLeft: 16,
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
        }}
      >
        {banner?.banner ? (
          <>
            <div
              style={{
                display: 'inline-block',
                position: 'relative',
                margin: '16px auto',
              }}
            >
              <img
                onMouseMove={(e) => {
                  const xClick = e.clientX - e.currentTarget.offsetLeft;
                  const yClick = e.clientY - e.currentTarget.offsetTop;

                  const x = ((xClick - 16) / 1000) * 100 - 1.5;
                  const y = (yClick / 600) * 100 - 12;

                  let result = {
                    x: x < 0 ? 0 : x,
                    y: y < 0 ? 0 : y,
                  };
                  setCoors(result);
                }}
                onClick={() => {
                  coor && setCoorsList([...coorList, coor]);
                  form.setFieldsValue(coor);
                  setModalOpen(true);
                }}
                src={banner?.banner}
                style={{
                  width: '1000px',
                  height: '600px',
                  objectFit: 'cover',
                }}
              />

              {banner?.products.map((item: any) => {
                if (item?.x !== 0 && item?.y !== 0) {
                  return (
                    <PlusCircleOutlined
                      key={item?.id}
                      style={{
                        position: 'absolute',
                        top: `${item.y}%`,
                        left: `${item.x}%`,
                      }}
                    />
                  );
                }
              })}
            </div>

            <div
              className="products"
              style={{ flexGrow: 1, height: 600, overflowY: 'scroll' }}
            >
              {banner?.products.map((item: any) => {
                if (item?.x !== 0 && item?.y !== 0) {
                  return (
                    <p key={item?.id}>
                      ({item.x}, {item.y}) -{item?.product?.name}
                    </p>
                  );
                }
              })}
            </div>
          </>
        ) : (
          <>
            {selectedFile ? (
              <>
                <div
                  style={{
                    display: 'inline-block',
                    position: 'relative',
                    margin: '16px auto',
                  }}
                >
                  <img
                    onMouseMove={(e) => {
                      const xClick = e.clientX - e.currentTarget.offsetLeft;
                      const yClick = e.clientY - e.currentTarget.offsetTop;

                      const x = ((xClick - 16) / 1000) * 100 - 1.5;
                      const y = (yClick / 600) * 100 - 12;

                      let result = {
                        x: x < 0 ? 0 : x,
                        y: y < 0 ? 0 : y,
                      };
                      setCoors(result);
                    }}
                    onClick={() => {
                      coor && setCoorsList([...coorList, coor]);
                      form.setFieldsValue(coor);
                      setModalOpen(true);
                    }}
                    src={preview || banner?.banner}
                    style={{
                      width: '1000px',
                      height: '600px',
                      objectFit: 'cover',
                    }}
                  />

                  {coorList.map((cors, index) => (
                    <PlusCircleOutlined
                      key={index}
                      style={{
                        position: 'absolute',
                        top: `${cors.y}%`,
                        left: `${cors.x}%`,
                      }}
                    />
                  ))}
                </div>

                <div
                  className="products"
                  style={{ flexGrow: 1, height: 600, overflowY: 'scroll' }}
                >
                  {coorList.map((item, index) => (
                    <p key={index}>
                      {item.x}, {item.y}
                    </p>
                  ))}
                </div>
              </>
            ) : (
              <h1 style={{ textAlign: 'center', flexGrow: 1 }}>
                Rasmni tanlang !
              </h1>
            )}
          </>
        )}
      </div>

      <Modal
        footer={null}
        open={isModalOpen}
        title="Yangi maxsulot qo'shish"
        onCancel={() => setModalOpen(false)}
      >
        <Form form={form} layout="vertical" onFinish={SendProductBanner}>
          <Form.Item
            name="x"
            label="X coordinatasi"
            style={{ width: '48%', display: 'inline-block', marginRight: 16 }}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="y"
            label="Y coordinatasi"
            style={{ width: '48%', display: 'inline-block' }}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item name="product" label="Maxsulotni tanlang">
            <Select
              allowClear
              options={products}
              className="customSelect"
              placeholder="Maxsulotni tanlagn"
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default App;
