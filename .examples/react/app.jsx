import React, { useState, useCallback, useRef } from 'react';
import { Formast } from '../../src/react';
import schemaJson from '../_shared/form.json';
import { isEmpty } from 'ts-fns';
import * as Options from '../../src/theme-react/index.js';

export default function App() {
  return <Form schemaJson={schemaJson} options={Options} />
}

export function Form(props) {
  const [errors, setErrors] = useState([]);
  const [data, setData] = useState({});
  const [random, setRandom] = useState(Math.random());
  const ref = useRef();

  const handleSubmit = useCallback((e) => {
    e.preventDefault();

    const errors = ref.current.validate();
    if (errors.length) {
      setErrors(errors);
      setData({});
      return;
    }

    const data = ref.current.toData();
    setErrors([]);
    setData(data);
  }, []);

  const getJson = () => new Promise((r) => {
    setTimeout(() => r(props.schemaJson), 2000);
  });

  const onSetRandom = () => {
    setRandom(Math.random());
  };

  return (
    <div>
      <Formast
        schema={getJson}
        props={{
          onSubmit: handleSubmit,
          onSetRandom: onSetRandom,
          random: random,
        }}
        options={props.options}
        onLoad={({ model }) => {
          ref.current = model;
          window.__model = model;
        }}
      >
        <span>正在加载...</span>
      </Formast>
      <div>
        {errors.map((err, i) => {
          return <div key={i} style={{ color: 'red' }}>{err.message}</div>
        })}
      </div>
      <pre>
        {isEmpty(data) ? null : JSON.stringify(data, null, 4)}
      </pre>
    </div>
  );
}
