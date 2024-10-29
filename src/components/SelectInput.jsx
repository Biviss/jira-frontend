import React, { useMemo, useRef, useState } from 'react';
import { Select } from 'antd';
import axios from 'axios';

let timeout;
let currentValue;
const fetch = async (value, callback) => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    currentValue = value;
    const fake = async () => {
        const responseVerify = await axios.get("http://localhost:3000/auth/", {});
        callback(responseVerify.data
        .filter((user) => user.email.startsWith(currentValue))
        .map((user) => ({
            text: user.email,
            value: user.id,
        })))
    };
    if (value) {
      timeout = setTimeout(fake, 300);
    } else {
      callback([]);
    }
};

export const SearchInput = ({onChange},props,) => {
    const [data, setData] = useState([]);
    const [value, setValue] = useState();
    const handleSearch = (newValue) => {
      fetch(newValue, setData);
    };
    const handleChange = (newValue,options) => {
      setValue(newValue);
      onChange(options.value);
      console.log(options.value)
    };
    return (
      <Select
        showSearch
        value={value}
        placeholder={props.placeholder}
        style={props.style}
        defaultActiveFirstOption={false}
        suffixIcon={null}
        filterOption={false}
        onSearch={handleSearch}
        onChange={handleChange}
        notFoundContent={null}
        options={(data || []).map((d) => ({
          value: d.value,
          label: d.text,
        }))}
      />
    );
  };