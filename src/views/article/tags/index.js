import { addTag, deleteTag, fetchTags } from "@/services/article";
import { PlusOutlined } from "@ant-design/icons";
import { Input, Space, Tag, Tooltip, theme } from "antd";
import { useEffect, useRef, useState } from "react";
const TagColor = {
  1: "magenta",
  2: "red",
  3: "volcano",
  4: "orange",
  5: "gold",
  6: "lime",
  7: "green",
  8: "cyan",
  9: "blue",
  10: "geekblue",
};

const Tags = () => {
  const { token } = theme.useToken();
  const [tags, setTags] = useState([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const inputRef = useRef(null);
  const editInputRef = useRef(null);

  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

  useEffect(() => {
    editInputRef.current?.focus();
  }, [inputValue]);

  useEffect(() => {
    getTags()
  }, []);

  const getTags = () => {
    fetchTags().then((res) => {
      const { data } = res;
      setTags(data || []);
    });
  };

  const handleClose = (removedTag) => {
    deleteTag(removedTag._id).then((res) => {
      if (res.code === 200) {
        const newTags = tags.filter((tag) => tag.name !== removedTag.name);
        setTags(newTags);
      }
    });
  };
  const showInput = () => {
    setInputVisible(true);
  };
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  const handleInputConfirm = () => {
    if (inputValue) {
      addTag(inputValue).then((res) => {
        if (res.code === 200) {
          setInputVisible(false);
          setInputValue("");
          getTags();
        }
      });
    }
  };

  const tagInputStyle = {
    width: 78,
    verticalAlign: "top",
  };
  const tagPlusStyle = {
    background: token.colorBgContainer,
    borderStyle: "dashed",
  };
  return (
    <Space size={[0, 8]} wrap>
      <Space size={[0, 8]} wrap>
        {tags.map((tag, index) => {
          const isLongTag = tag.name.length > 20;
          const tagElem = (
            <Tag
              key={tag._id}
              closable={index !== 0}
              style={{
                userSelect: "none",
              }}
              onClose={() => handleClose(tag)}
              color={TagColor[(index + 1) % 10]}
            >
              <span>
                {isLongTag ? `${tag.name.slice(0, 20)}...` : tag.name}
              </span>
            </Tag>
          );
          return isLongTag ? (
            <Tooltip title={tag.name} key={tag._id}>
              {tagElem}
            </Tooltip>
          ) : (
            tagElem
          );
        })}
      </Space>
      {inputVisible ? (
        <Input
          ref={inputRef}
          type="text"
          size="small"
          style={tagInputStyle}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
        />
      ) : (
        <Tag style={tagPlusStyle} onClick={showInput}>
          <PlusOutlined /> 新标签
        </Tag>
      )}
    </Space>
  );
};
export default Tags;
