import React, { useState } from "react";
import {
  Modal,
  Table,
  Group,
  Button,
  Input,
  Autocomplete,
  Stepper,
  NumberInput,
} from "@mantine/core";
import { IconAt } from "@tabler/icons-react";
import { v4 as uuidv4 } from "uuid";
import { ethers } from "ethers";
import Web3 from "web3";
import emailjs from "@emailjs/browser";
import { abi, address } from "../Contract/Contract";
const Check_Order = ({
  Open_Order,
  setOpen_Order,
  room_uuid_for_order,
  Contract_Room_money,
  Contract_Room_name,
  Contract_Room_address,
  Contract_Room_wallet_addr,
  datestart_ans,
  datesEnd_ans,
}) => {
  const [verification_email, setverification_email] = useState("");
  const [theEmail, settheEmail] = useState("");
  const [theEmailbackup, settheEmailbackup] = useState("");
  const [theemailCheck, settheemailCheck] = useState();
  const [buttoncheck, setbuttoncheck] = useState(false);

  const [active, setActive] = useState(1);
  const nextStep = () => {
    if (active == 0) {
      sendEmail();
      setTimeout(() => {
        setActive((current) => (current < 3 ? current + 1 : current));
      }, 1000);
    } else {
      push_Order();
      // console.log(theEmailbackup);
    }
  };
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const data =
    theEmail.trim().length > 0 && !theEmail.includes("@")
      ? ["gmail.com", "outlook.com", "yahoo.com"].map(
          (provider) => `${theEmail}@${provider}`
        )
      : [];
  const Chenck_order_time_start = new Date(datestart_ans).toString();
  const Chenck_order_time_End = new Date(datesEnd_ans).toString();
  async function sendEmail() {
    settheEmailbackup(theEmail);
    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    setverification_email(verificationCode.toString());
    const templateParams = {
      user_email_name: theEmail,
      verificationCode: verificationCode,
      to_email: theEmail,
    };
    emailjs
      .send(
        "service_39ygwyg",
        "template_abitdrg",
        templateParams,
        "G16P96rYbYW6SAV1U"
      )
      .then(
        (response) => {
          console.log(
            "Email sent successfully:",
            response.status,
            response.text
          );
          alert("Verification code sent successfully!");
        },
        (error) => {
          console.log("Email failed:", error);
          alert("Email failed. Please try again.");
        }
      );
  }

  function checkemail() {
    // console.log(theemailCheck.toString().length);
    try {
      if (theemailCheck.toString().length == 6) {
        if (theemailCheck.toString() == verification_email) {
          window.alert("正確");
          setbuttoncheck(true);
          setverification_email("");
          settheEmail("");
          settheemailCheck("");
          
        } else {
          window.alert("驗證碼錯誤");
        }
      } else {
        window.alert("驗證碼錯誤");
      }
    } catch (error) {
      window.alert("驗證碼錯誤!,請輸入數字。");
    }
  }

  async function push_Order() {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contractInstance_singner = new ethers.Contract(address, abi, signer);

    console.log(Chenck_order_time_start, Chenck_order_time_End);
    const Contract_datestart_time = parseInt(
      datestart_ans.toString().substring(0, 10)
    );
    const Contract_dateEnd_time = parseInt(
      datesEnd_ans.toString().substring(0, 10)
    );
    console.log(Contract_datestart_time, Contract_dateEnd_time);
    var wallet_address;
    const ether_accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    var account = ether_accounts[0];
    wallet_address = account;
    let amount = Web3.utils.toWei("0.0001");
    await contractInstance_singner.add_order(
      uuidv4(),
      room_uuid_for_order,
      Contract_Room_money,
      Contract_Room_name,
      Contract_Room_address,
      Contract_Room_wallet_addr,
      Contract_datestart_time,
      Contract_dateEnd_time,
      { from: wallet_address, value: amount }
    );
    setbuttoncheck(false);
    setActive(0);
    setOpen_Order((o) => !o);
  }
  return (
    <Modal
      size={window.innerWidth > 800 ? "60%" : "100%"}
      opened={Open_Order}
      onClose={() => {
        setOpen_Order((o) => !o);
      }}
      title="刊登房間"
      centered
    >
      <>
        <Stepper
          active={active}
          onStepClick={setActive}
          breakpoint="sm"
          allowNextStepsSelect={false}
        >
          <Stepper.Step label="First step" description="Create an account">
            <Table withBorder striped>
              <thead>
                <tr>
                  <th style={{ textAlign: "center" }}>確認資訊</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>房間名稱: {Contract_Room_name}</th>
                </tr>
                <tr>
                  <th>房間地址: {Contract_Room_address}</th>
                </tr>
                <tr>
                  <th>房間價格: {Contract_Room_money}</th>
                </tr>
                <tr>
                  <th>入住時間: {Chenck_order_time_start}</th>
                </tr>
                <tr>
                  <th>退房時間: {Chenck_order_time_End}</th>
                </tr>
              </tbody>
              <Group position="center" mt="xl">
                <Autocomplete
                  value={theEmail}
                  onChange={settheEmail}
                  placeholder="pls type ur Email"
                  data={data}
                />
              </Group>
              <Group position="center" mt="xl"></Group>
            </Table>
          </Stepper.Step>
          <Stepper.Step label="Second step" description="Verify email">
            <Input
              icon={<IconAt />}
              placeholder="Your email"
              value={theEmailbackup}
              disabled
            />
            <Group position="center" mt="xl">
              <NumberInput
                value={theemailCheck}
                onChange={settheemailCheck}
                hideControls
              />
              <Button onClick={checkemail}>check Email</Button>
            </Group>
          </Stepper.Step>

          <Stepper.Completed>
            Completed, click back button to get to previous step
          </Stepper.Completed>
        </Stepper>

        <Group position="center" mt="xl">
          <Button variant="default" onClick={prevStep}>
            Back
          </Button>
          {active == 0 ? (
            <>
              {" "}
              <Button onClick={nextStep}>
                {active == 0 ? "寄送驗證碼至信箱" : "確定刊登"}
              </Button>
            </>
          ) : (
            <>
              {buttoncheck ? (
                <Button onClick={nextStep}>確定刊登</Button>
              ) : (
                <Button disabled>確定刊登</Button>
              )}
            </>
          )}
        </Group>
      </>
    </Modal>
  );
};

export default Check_Order;
