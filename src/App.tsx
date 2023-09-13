import {
  Button,
  Form,
  Input,
  Modal,
  Popover,
  Select,
  Statistic,
  Upload,
} from 'antd';
import { useEffect, useState } from 'react';
import { UploadOutlined, PlusCircleOutlined } from '@ant-design/icons';
import {
  AddProductsShowroom,
  AddShowroomConfig,
  GetProductsConfig,
  GetShowroomConfig,
  getShopsConfig,
} from './service/api';
import { OptionProps } from 'antd/es/mentions';
import { useSearchParams } from 'react-router-dom';
import { Ishop } from './type';
import { DeleteOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import './main.css';

function App() {
  const [form] = Form.useForm();
  const [searchParams, setSearchParams] = useSearchParams();
  const [preview, setPreview] = useState<string>();
  const [selectedFile, setSelectedFile] = useState<any>();
  const [shops, setShops] = useState<OptionProps[]>([]);
  const [coor, setCoors] = useState<{ x: number; y: number }>();
  const [coorList, setCoorsList] = useState<{ x: number; y: number }[]>([]);
  const [shop] = useState(searchParams.get('shop'));
  const [banner, setBanner] = useState<any>({});
  const [products, setProducts] = useState<any>([]);
  const [isModalOpen, setModalOpen] = useState(false);

  const DotPopover = (props: any) => {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {props?.colors?.map((item: string) => (
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: 50,
              background: item,
            }}
          ></div>
        ))}
      </div>
    );
  };

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
    AddShowroomConfig(formData, searchParams.get('session_id') || '').then(
      (res) => {
        handleMakeParams('bannerId', res.data?.id);
        setBanner(res.data);
      }
    );
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

    await AddProductsShowroom(
      searchParams.get('bannerId'),
      {
        products: [...olderProducts, val],
      },
      searchParams.get('session_id') || ''
    );
    getBanner();
    setModalOpen(false);
    form.resetFields();
  };
  const DeleteProducts = async (id: number) => {
    const result: { x: any; y: any; product: any }[] = [];
    banner?.products?.forEach((item: any) => {
      if (item?.id !== id) {
        result.push({
          x: item?.x,
          y: item?.y,
          product: item?.product?.id,
        });
      }
    });

    await AddProductsShowroom(
      searchParams.get('bannerId'),
      {
        products: result,
      },
      searchParams.get('session_id') || ''
    );
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
        <Button icon={<ArrowLeftOutlined />}>
          <a href={'/dashboard/shops/showroom/'}>Orqaga qaytish</a>
        </Button>

        {!searchParams.get('bannerId') && (
          <>
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

                handleMakeParams('bannerId', '');
                setSelectedFile('');
                setPreview('');
                setBanner('');
              }}
            />
          </>
        )}
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
                    <Popover
                      content={<DotPopover {...item.product} />}
                      title={item?.product?.name}
                    >
                      <PlusCircleOutlined
                        key={item?.id}
                        style={{
                          position: 'absolute',
                          top: `${item.y}%`,
                          left: `${item.x}%`,
                        }}
                      />
                    </Popover>
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
                    <p
                      key={item?.id}
                      style={{ fontSize: 24, fontFamily: 'sans-serif' }}
                    >
                      (
                      {
                        <Statistic
                          precision={2}
                          value={item.x}
                          style={{ display: 'inline-block' }}
                        />
                      }
                      ,{' '}
                      {
                        <Statistic
                          precision={2}
                          value={item.y}
                          style={{ display: 'inline-block' }}
                        />
                      }
                      ) - {item?.product?.name}{' '}
                      <Button
                        danger
                        type="primary"
                        icon={<DeleteOutlined />}
                        onClick={() => DeleteProducts(item.id)}
                      />
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
