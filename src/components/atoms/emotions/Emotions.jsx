import React from "react";
import styles from "../../../../styles/component/Emotions.module.css";

export default function Emotions() {
  return (
    <>
      <div className={styles.feedback}>
        <label className={styles.angry}>
          <input name="feedback" value="1" type="radio" />
          <div>
            <svg className={`${styles.eye} ${styles.left}`}></svg>
            <svg className={`${styles.eye} ${styles.right}`}></svg>
            <svg className={styles.mouth}></svg>
          </div>
        </label>
        <label className={styles.sad}>
          <input name="feedback" value="2" type="radio" />
          <div>
            <svg className={`${styles.eye} ${styles.left}`}></svg>
            <svg className={`${styles.eye} ${styles.right}`}></svg>
            <svg className={styles.mouth}></svg>
          </div>
        </label>
        <label className={styles.ok}>
          <input name="feedback" value="3" type="radio" />
          <div></div>
        </label>
        <label className={styles.good}>
          <input defaultChecked name="feedback" value="4" type="radio" />
          <div>
            <svg className={`${styles.eye} ${styles.left}`}></svg>
            <svg className={`${styles.eye} ${styles.right}`}></svg>
            <svg className={styles.mouth}></svg>
          </div>
        </label>
        <label className={styles.happy}>
          <input name="feedback" value="5" type="radio" />
          <div>
            <svg className={`${styles.eye} ${styles.left}`}></svg>
            <svg className={`${styles.eye} ${styles.right}`}></svg>
          </div>
        </label>
      </div>

      <svg style={{ display: "none" }} xmlns="http://www.w3.org/2000/svg">
        <symbol id="eye" viewBox="0 0 7 4" xmlns="http://www.w3.org/2000/svg">
          <path d="M1,1 C1.83333333,2.16666667 2.66666667,2.75 3.5,2.75 C4.33333333,2.75 5.16666667,2.16666667 6,1"></path>
        </symbol>
        <symbol
          id="mouth"
          viewBox="0 0 18 7"
          xmlns="http://www.w3.org/2000/svg">
          <path d="M1,5.5 C3.66666667,2.5 6.33333333,1 9,1 C11.6666667,1 14.3333333,2.5 17,5.5"></path>
        </symbol>
      </svg>
    </>
  );
}
