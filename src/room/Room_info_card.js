import React, { useEffect, useState } from "react";
import "../Mid/Mid.css";
import { createStyles, Image, Button } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import {
  CarOutlined,
  WifiOutlined,
  FireOutlined,
  CoffeeOutlined,
} from "@ant-design/icons";
import BathtubIcon from "@mui/icons-material/Bathtub";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import { useLocation } from "react-router-dom";
import { abi, address } from "../Contract/Contract";
import { ethers } from "ethers";
import Order from "../Order/Order";
const useStyles = createStyles((theme) => ({
  root: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[8] : "#E5E8EB",
    padding: "13px 0px 0px 0px",
  },
  Carousel_div: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : "#E5E8EB",
    margin: "10px 0px 0px 0px",
    height: window.innerWidth < 500 ? 226 : 326,
    borderBottom:
      theme.colorScheme === "dark"
        ? "1px solid " + theme.colors.dark[5]
        : "1px solid #EDEFF2",
    borderTop:
      theme.colorScheme === "dark"
        ? "1px solid " + theme.colors.dark[5]
        : "1px solid #EDEFF2",
    width: "100%",
  },
  reservediv:{
    display: "flex",
    width: "55%",
    marginRight: "20px",
    justifyContent: "center",
    border:
    theme.colorScheme === "dark"
      ? "1px solid #EDEFF2"
      : "1px solid " + theme.colors.dark[7],
      borderRadius:"20px",
      [theme.fn.smallerThan('1024')]: {
        width: "100%",
        marginRight: "0px",
      },
  },
  reserveMain: {
    display: "flex",  justifyContent: "center",  height: "70%",marginTop:"10px", alignItems: "center",
      [theme.fn.smallerThan('1024')]: {
      display: "flex", height: "75%",flexDirection:"column",marginTop:"10px"
    },

  },
  reserveLeft: {
    // border: '1px solid white',
    width: "90%",
    maxWidth: "800px",
    position: "relative",
  },

  reserveRight: {
    border: "1px solid white",
    width: "30%",
    maxWidth: "400px",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  reserveRoomName: {
    margin: "0",
    fontSize: "36px",
    // color: 'white',
    color: theme.colorScheme === "dark" ? "white" : +theme.colors.dark[7],
    letterSpacing: "3.76px",
    fontWeight: "700",
    fontFamily: "NotoSansTC-Medium,Noto Sans TC,sans-serif",
    width: "50%",
    wordWrap: "break-word",
  },
  roomBasicDescription: {
    display: "inline-block",
    marginTop: "1vh",
    fontSize: "14px",
    // color: '#c4c4c4',
    color: theme.colorScheme === "dark" ? "#c4c4c4" : +theme.colors.dark[7],
    letterSpacing: "1.46px",
    lineHeight: "31px",
    wordWrap: "break-word",
    width: "100%",
  },
  roomDescription: {
    fontSize: "12px",
    textAlign: "justify",
    // color: '#c4c4c4',
    color: theme.colorScheme === "dark" ? "#c4c4c4" : +theme.colors.dark[7],
    letterSpacing: "1.25px",
    lineHeight: "20px",
    wordWrap: "break-word",
  },
  iconSection: {
    marginTop: "40px",
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[3]
        : "rgba(16 18 27 / 20%)",
    // color: 'white',
    color: theme.colorScheme === "dark" ? "white" : +theme.colors.dark[7],

    height: "27.62vh",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: "10vh",
    borderRadius: "20px",
  },
  roomIcon: {
    width: "30%",
    fontSize: "12px",
    letterSpacing: "1.25px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center", //加了圖片之後可能要改 這個是水平
  },
  RightCtrlWindow: {
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    width: "50%",
    // maxWidth: '100%',
    // marginBottom: '15vh'
    // flexGrow:'1'
  },
  roomPrice: {
    // color: 'white',
    color: theme.colorScheme === "dark" ? "white" : +theme.colors.dark[7],
    fontSize: "30px",
    letterSpacing: "3.13px",
    // display: 'flex',
    // justifyContent: 'flex-end',
    width: "auto",
    maxWidth: "100%",
    wordWrap: "break-word",
    // whiteSpace:'nowrap'
  },
  roomPriceDescribe: {
    fontSize: "14px",
    width: "auto",
    maxWidth: "100%",
    // whiteSpace:'nowrap'
    // display: 'flex',
    // justifyContent: 'flex-end',
  },

  Orderdiv:{
    border:
      theme.colorScheme === "dark"
        ? "1px solid #EDEFF2"
        : "1px solid " + theme.colors.dark[7],
      display:"flex",
      width: "25%",
      justifyContent:"center",
      flexDirection:"column",
      borderRadius:"20px",
      [theme.fn.smallerThan('1024')]: {
        marginTop:"10px",
        width: "100%",
      },
  }
}));
function Room_info_card() {
  //底下取得當前網址
  const location = useLocation();

  //
  const [usewidth, setusewidth] = useState(window.innerWidth);
  const { classes } = useStyles();
  //
  const [Contract_Room_wallet_addr, set_Contract_Room_wallet_addr] =useState("");
  const [Contract_phone, set_Contract_phone] = useState("");
  const [Contract_Room_type, set_Contract_Room_type] = useState(0);
  const [Contract_Room_address, set_Contract_Room_address] = useState("");
  const [Contract_introduce, set_Contract_introduce] = useState(""); //房間描述
  const [Contract_Room_name, set_Contract_Room_name] = useState("");
  const [Contract_equiment, set_Contract_equiment] = useState([]); //各種配件
  const [Contract_equimentfulse, set_Contract_equimentfulse] = useState([]); //各種配件的沒勾選版本
  const [Contract_image_files, set_Contract_image_files] = useState([]);
  const [Contract_Room_money, set_Contract_Room_money] = useState(0);
  const [openorder, setopenorder] = useState(false)
  const [SliderList, setSliderList] = useState([]);
  const [room_uuid_for_order, setroom_uuid_for_order] = useState()

  async function open_Order() {

  }
  async function getRoomInfo() {
    const allequiment = [
      "free_parking",
      "free_wifi",
      "spa",
      "tub",
      "coffee_shop",
      "Gym",
    ];
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contractInstance_singner = new ethers.Contract(address, abi, signer);
    //使用singer 連接合約 對合約有可讀寫權限
    const contractInstance_provider = new ethers.Contract(
      address,
      abi,
      provider
    );
    const uuid_room = location.pathname.substring("/user/".length);
    let api = await contractInstance_provider.getrooms(uuid_room);
    setroom_uuid_for_order(uuid_room)
    set_Contract_Room_wallet_addr(api[0]);
    set_Contract_phone(api[1]);
    set_Contract_Room_type(api[2]);
    set_Contract_Room_address(api[3]);
    set_Contract_introduce(api[4]);
    set_Contract_Room_name(api[5]);
    set_Contract_equiment(api[6]);
    set_Contract_image_files(api[8]);
    let image_files = [...api[8]];
    set_Contract_Room_money(api[9]);
    let equiment_copy = [...api[6]];
    const equiment_false = allequiment.filter(
      (item) => !equiment_copy.includes(item)
    );
    set_Contract_equimentfulse(equiment_false);
    console.log(image_files);
    // console.log(equiment_false);
    getSlider_Card(image_files);
  }
  {
    /*//TODO:有時間把Slider_Card寫成一個元件(MAP)*/
  }
  async function getSlider_Card(image_files) {
    let slider_arr = [];
    switch (image_files.length) {
      case 1:
        for (let index = 0; index < image_files.length; index++) {
          slider_arr[index] = (
            <Carousel.Slide
              style={{ width: "100vw" }}
              key={
                "https://www.uwood.com.tw/userfiles/case/35220211101143019.jpg"
              }
            >
              <Image
                height="300px"
                src={
                  "https://www.uwood.com.tw/userfiles/case/35220211101143019.jpg"
                }
              />
            </Carousel.Slide>
          );
        }
        setSliderList(slider_arr);
        break;
      case 2:
        for (let index = 0; index < image_files.length; index++) {
          slider_arr[index] = (
            <Carousel.Slide
              style={{ width: "50vw" }}
              key={
                "https://www.uwood.com.tw/userfiles/case/35220211101143019.jpg"
              }
            >
              <Image
                height="300px"
                src={
                  "https://www.uwood.com.tw/userfiles/case/35220211101143019.jpg"
                }
              />
            </Carousel.Slide>
          );
        }
        setSliderList(slider_arr);
        break;
      case 3:
        for (let index = 0; index < image_files.length; index++) {
          slider_arr[index] = (
            <Carousel.Slide
              key={
                "https://www.uwood.com.tw/userfiles/case/35220211101143019.jpg"
              }
            >
              <Image
                height="300px"
                src={
                  "https://www.uwood.com.tw/userfiles/case/35220211101143019.jpg"
                }
              />
            </Carousel.Slide>
          );
        }
        setSliderList(slider_arr);
        break;
      default:
        break;
    }
    console.log(Contract_image_files.length);
  }
  useEffect(() => {
    getRoomInfo();
  }, []);

  //
  // console.log(Contract_Room_wallet_addr);//測試
  return (
    <div>
      {/*外框*/}
      <div style={{ width: "100%" }}>
        {" "}
        {/*上滑條*/}
        <div className={classes.Carousel_div}>
          {/*//TODO:有時間把Slider_Card寫成一個元件(MAP)*/}
          <Carousel
            className={classes.root}
            slideSize="100%"
            height={usewidth < 500 ? 200 : 300}
            slideGap="xs"
            controlsOffset="xs"
            dragFree
            withIndicators
          >
            {/* <Carousel.Slide style={{ width: "50vw" }} key={"https://www.uwood.com.tw/userfiles/case/35220211101143019.jpg"}>
                            <Image height="300px" src={"https://www.uwood.com.tw/userfiles/case/35220211101143019.jpg"} />
                        </Carousel.Slide>
                        <Carousel.Slide style={{ width: "50vw" }} key={"https://www.uwood.com.tw/userfiles/case/35220211101143019.jpg"}>
                            <Image height="300px" src={"https://www.uwood.com.tw/userfiles/case/35220211101143019.jpg"} />
                        </Carousel.Slide>
                        <Carousel.Slide style={{ width: "100vw" }} key={"https://www.uwood.com.tw/userfiles/case/35220211101143019.jpg"}>
                            <Image height="300px" src={"https://www.uwood.com.tw/userfiles/case/35220211101143019.jpg"} />
                        </Carousel.Slide> */}
            {SliderList}
          </Carousel>
        </div>
      </div>
      <div className={classes.reserveMain}>
        <div className={classes.reservediv}>
        <div className={classes.reserveLeft}>
            {/*left*/}
            <div
              style={{
                display: "flex",
                flexDirection:"column",
                marginTop: "10px",
              }}
            >
              <span className={classes.reserveRoomName}>
                {Contract_Room_name}{" "}
              </span>
              <div className={classes.RightCtrlWindow}>
                <span className={classes.roomPrice}>
                  NT.{Contract_Room_money}
                </span>
                <span className={classes.roomPriceDescribe}>全星期(一~日)</span>
                <br />
              </div>
            </div>
            <span className={classes.roomBasicDescription}>
              房東錢包地址: {Contract_Room_wallet_addr}
              <br />
              房間地址: {Contract_Room_address}
              <br />
              房型: {Contract_Room_type}人房
              <br />
              備註: 無<br />
            </span>
            <p className={classes.roomDescription}>{Contract_introduce}</p>
            <div className={classes.iconSection}>
              {/*//TODO:小遺憾 沒有順序*/}
              {Contract_equiment.map((thekey, index) => {
                let iconContent;
                console.log(thekey, index);
                switch (thekey) {
                  case "free_parking":
                    return (
                      <div
                        className={classes.roomIcon}
                        style={{ opacity: thekey ? 1 : 0.3 }}
                      >
                        <CarOutlined style={{ fontSize: "1.5rem" }} />
                        &nbsp;免費停車
                      </div>
                    );
                  case "free_wifi":
                    return (
                      <div
                        className={classes.roomIcon}
                        style={{ opacity: thekey ? 1 : 0.3 }}
                      >
                        <WifiOutlined style={{ fontSize: "1.5rem" }} />
                        &nbsp;免費網路
                      </div>
                    );

                  case "spa":
                    return (
                      <div
                        className={classes.roomIcon}
                        style={{ opacity: thekey ? 1 : 0.3 }}
                      >
                        <FireOutlined style={{ fontSize: "1.5rem" }} />
                        &nbsp;附有溫泉
                      </div>
                    );
                  case "tub":
                    return (
                      <div
                        className={classes.roomIcon}
                        style={{ opacity: thekey ? 1 : 0.3 }}
                      >
                        <BathtubIcon style={{ fontSize: "1.5rem" }} />
                        &nbsp;附有浴缸
                      </div>
                    );
                  case "coffee_shop":
                    return (
                      <div
                        className={classes.roomIcon}
                        style={{ opacity: thekey ? 1 : 0.3 }}
                      >
                        <CoffeeOutlined style={{ fontSize: "1.5rem" }} />
                        &nbsp;有咖啡廳
                      </div>
                    );
                  case "Gym":
                    return (
                      <div
                        className={classes.roomIcon}
                        style={{ opacity: thekey ? 1 : 0.3 }}
                      >
                        <FitnessCenterIcon style={{ fontSize: "1.5rem" }} />
                        &nbsp;有健身房
                      </div>
                    );
                  default:
                    iconContent = "UNKNOWN";
                    break;
                }
              })}
              {Contract_equimentfulse.map((thekey, index) => {
                let iconContent;
                console.log(thekey, index);
                switch (thekey) {
                  case "free_parking":
                    return (
                      <div
                        className={classes.roomIcon}
                        style={{ opacity: thekey ? 0.3 : 1 }}
                      >
                        <CarOutlined style={{ fontSize: "1.5rem" }} />
                        &nbsp;免費停車
                      </div>
                    );
                  case "free_wifi":
                    return (
                      <div
                        className={classes.roomIcon}
                        style={{ opacity: thekey ? 0.3 : 1 }}
                      >
                        <WifiOutlined style={{ fontSize: "1.5rem" }} />
                        &nbsp;免費網路
                      </div>
                    );

                  case "spa":
                    return (
                      <div
                        className={classes.roomIcon}
                        style={{ opacity: thekey ? 0.3 : 1 }}
                      >
                        <FireOutlined style={{ fontSize: "1.5rem" }} />
                        &nbsp;附有溫泉
                      </div>
                    );
                  case "tub":
                    return (
                      <div
                        className={classes.roomIcon}
                        style={{ opacity: thekey ? 0.3 : 1 }}
                      >
                        <BathtubIcon style={{ fontSize: "1.5rem" }} />
                        &nbsp;附有浴缸
                      </div>
                    );
                  case "coffee_shop":
                    return (
                      <div
                        className={classes.roomIcon}
                        style={{ opacity: thekey ? 0.3 : 1 }}
                      >
                        <CoffeeOutlined style={{ fontSize: "1.5rem" }} />
                        &nbsp;有咖啡廳
                      </div>
                    );
                  case "Gym":
                    return (
                      <div
                        className={classes.roomIcon}
                        style={{ opacity: thekey ? 0.3 : 1 }}
                      >
                        <FitnessCenterIcon style={{ fontSize: "1.5rem" }} />
                        &nbsp;有健身房
                      </div>
                    );
                  default:
                    iconContent = "UNKNOWN";
                    break;
                }
              })}
            </div>

          </div>
        </div>
        <div className={classes.Orderdiv}>
          <Order room_uuid_for_order={room_uuid_for_order} Contract_Room_money={Contract_Room_money} 
                Contract_Room_name={Contract_Room_name} Contract_Room_address={Contract_Room_address}
                Contract_Room_wallet_addr={Contract_Room_wallet_addr}/>
        </div>
      </div>
    </div>
  );
}

export default Room_info_card;
