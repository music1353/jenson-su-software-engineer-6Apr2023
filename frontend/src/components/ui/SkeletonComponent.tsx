import React from "react";
import { Skeleton } from "antd";


const SekeletonComponent: React.FC = () => {
  return (
    <article className="page-body">
      <section className="body-content spotlight-card">
        <Skeleton avatar paragraph={{ rows: 2 }} />
      </section>

      <section className="body-content spotlight-card">
        <div className="content-body body-list list-split">
          {
            Array(3).fill(null).map((_, index) => {
              return (
                <div
                  className="list__item"
                  key={index}
                >
                  <Skeleton
                    avatar={{
                      shape: "square"
                    }}
                    paragraph={{ rows: 3 }}
                  />
                </div>
              )
            })
          }
        </div>
      </section>
    </article>
  )
}

export default SekeletonComponent;