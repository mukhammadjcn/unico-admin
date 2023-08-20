import { Button, Select, Upload } from 'antd';
import { useEffect, useState } from 'react';
import { UploadOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { AddShowroomConfig, getShopsConfig } from './service/api';
import { OptionProps } from 'antd/es/mentions';
import { useSearchParams } from 'react-router-dom';

interface Ishop {
  created_at: string;
  description: string;
  email: string;
  facebook: string;
  id: 2;
  instagram: string;
  logo: string;
  name: string;
  phone: string;
  telegram: string;
  updated_at: string;
}

function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [preview, setPreview] = useState<string>();
  const [selectedFile, setSelectedFile] = useState();
  const [shops, setShops] = useState<OptionProps[]>([]);
  const [coor, setCoors] = useState<{ x: number; y: number }>();
  const [coorList, setCoorsList] = useState<{ x: number; y: number }[]>([]);
  const [shop] = useState(searchParams.get('shop'));

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
  useEffect(() => {
    getShops();
  }, []);

  // create a preview as a side effect, whenever selected file is changed
  const onSelectFile = (file: any) => {
    const formData = new FormData();

    formData.append('file', file);
    formData.append('shop', searchParams.get('shop') || '');

    AddShowroomConfig(formData).then(() => {
      setSelectedFile(file);
    });
  };
  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

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
          onChange={(id) => handleMakeParams('shop', id)}
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
                  setCoors({
                    x: x < 0 ? 0 : x,
                    y: y < 0 ? 0 : y,
                  });
                }}
                onClick={() => {
                  coor && setCoorsList([...coorList, coor]);
                }}
                src={preview}
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

            <div className="products" style={{ flexGrow: 1 }}>
              {coorList.map((item, index) => (
                <p key={index}>
                  {item.x}, {item.y}
                </p>
              ))}
            </div>
          </>
        ) : (
          <h1 style={{ textAlign: 'center', flexGrow: 1 }}>Rasmni tanlang !</h1>
        )}
      </div>
    </div>
  );
}

export default App;
