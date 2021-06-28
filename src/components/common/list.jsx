import React from "react";
import { Badge } from "react-bootstrap";

const List = ({ data, onDelete }) => {
  return (
    <>
      {data &&
        data.map((obj) => (
          <Badge pill variant="light" className="m-2 badge-bg">
            {obj}
            <i
              className=" ml-2 fa fa-times-circle"
              aria-hidden="true"
              onClick={() => onDelete(obj)}
            ></i>
          </Badge>
        ))}
    </>
  );
};

export default List;
