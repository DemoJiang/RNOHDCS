import { LinearGradient, PaintProps, useFont, vec } from "@react-native-oh-tpl/react-native-skia";
import React, { useState } from "react";
import { ScrollView, StyleSheet, View, Text } from "react-native";
import {
  CartesianChart,
  Scatter,
  useChartPressState,
  type ScatterShape,
} from "@react-native-oh-tpl/victory-native-xl";
import inter from "../../assets/inter-medium.ttf";
import { appColors } from "./consts/colors";
import { Button } from "../components/Button";
import { Tester, TestCase, TestSuite } from '@rnoh/testerino';
const TestNumber = [1,15,25,90,45,60,8,16];
const DATA = (length: number = 10) =>
  Array.from({ length }, (_, index) => ({
    month: index + 1,
    listenCount: Math.floor(Math.random() * (20)) + 10,
  }));

const DATATest = (length: number = 8) =>
  Array.from({ length }, (_, index) => ({
    month: index + 1,
    listenCount: TestNumber[index],
  }));  

export default function ScatterPage() {
  const font = useFont(inter, 12);
  const [dataTest, setDataTest] = useState(DATA(5));
  const [data5, setData5] = useState(DATATest())
  const [data6, setData6] = useState(DATATest())
  const [radius, setRadius] = useState(10);
  const [shape, setShape] = useState("circle" as ScatterShape);
  const [color, setColor] = useState("#0000FF");
  const [style, setStyle] = useState("fill" as PaintProps["style"]);
  const [strokeWidth, setStrokeWidth] = useState(3);
  const { state, isActive } = useChartPressState({
    x: 0,
    y: { listenCount: 0 },
  });
  const [linearGradient, setLinearGradient] = useState(false);
  console.log('999999999999999999***********************************************************')
  return (
    <Tester style={{ flex: 1 }}>
      <TestCase itShould="case1: 散点图 图表">
        <View style={{ height: 180 }}>
          <CartesianChart
            xKey="month"
            padding={{left: 5, right: 5, bottom: 10}}
            yKeys={["listenCount"]}
            domainPadding={{ left: 50, right: 50, top: 30, bottom: 0 }}
            domain={{ x:[0, 30], y: [0, 30] }}
            chartPressState={state}
            axisOptions={{ 
              font
            }}
            data={data6}
          >
            {({ points }) => {
              return (
                <>
                  <Scatter
                    points={points.listenCount}
                    radius={radius}
                    shape={shape}
                    style={style}
                    color={color}
                    animate={{ type: "spring" }}
                    strokeWidth={strokeWidth} >
                    {linearGradient?<LinearGradient
                          start={vec(0, 0)}
                          end={vec(0, 400)}
                          colors={["#FF0000", "#0000FF"]}
                    />:null}
                           
                  </Scatter>
                </>
              );
            }}
          </CartesianChart>
        </View>
      </TestCase>

      <ScrollView
        style={styles.optionsScrollView}
        contentContainerStyle={styles.options}
      >
        <TestCase itShould="case2: points 属性 更新点位数据">

        <View
              style={{
                flexDirection: "row",
                gap: 12,
                marginVertical: 16,
                marginTop: 3,
                marginBottom: 3,
              }}
            >
              <Button
                style={{ flex: 1 }}
                onPress={() => {
                  setData6((data6) => DATA(6))
                }}
                title="points num 6"
              />
              <Button
                style={{ flex: 1 }}
                onPress={() => 
                  setData6((data6) => DATA(4))
                }
                title="points num 4"
              />
            </View>
        </TestCase>

        <TestCase itShould="case3: radius 属性 设置点的半径">
          <View
            style={{
              flexDirection: "row",
              gap: 12,
              marginVertical: 16,
              marginTop: 3,
              marginBottom: 3,
            }}
          >
            <Button
              style={{ flex: 1 }}
              onPress={() => { setRadius(radius + 2) }}
              title="up"
            />
            <Button
              style={{ flex: 1 }}
              onPress={() => { setRadius(radius - 2) }}
              title="down"
            />
          </View>
        </TestCase>

        <TestCase itShould="case4: shape 属性 设置点的形状 circle圆形 square正方形 star星形">
          <View
            style={{
              flexDirection: "row",
              gap: 12,
              marginVertical: 16,
              marginTop: 3,
              marginBottom: 3,
            }}
          >
            <Button
              style={{ flex: 1 }}
              onPress={() => setShape("circle")}
              title="circle"
            />
            <Button
              style={{ flex: 1 }}
              onPress={() => setShape("square")}
              title="square"
            />
            <Button
              style={{ flex: 1 }}
              onPress={() => setShape("star")}
              title="star"
            />
          </View>
        </TestCase>

        <TestCase itShould="case5: color 属性 设置颜色">
          <View
            style={{
              flexDirection: "row",
              gap: 12,
              marginVertical: 16,
              marginTop: 3,
              marginBottom: 3,
            }}
          >
            <Button
              style={{ flex: 1 }}
              onPress={() => setColor("red")}
              title="red"
            />
            <Button
              style={{ flex: 1 }}
              onPress={() => setColor("blue")}
              title="blue"
            />
          </View>
        </TestCase>

        <TestCase itShould="case6: style 属性 设置每个点是填充还是中空">
          <View
            style={{
              flexDirection: "row",
              gap: 12,
              marginVertical: 16,
              marginTop: 3,
              marginBottom: 3,
            }}
          >
            <Button
              style={{ flex: 1 }}
              onPress={() => {
                if (style == "fill") {
                  setStyle("stroke");
                }
                else {
                  setStyle("fill");
                }
              }}
              title="styleChange"
            />
          </View>
        </TestCase>

        <TestCase itShould="case7: strokeWidth 属性 设置线条宽度，只有在中空时生效">
          <View
            style={{
              flexDirection: "row",
              gap: 12,
              marginVertical: 16,
              marginTop: 3,
              marginBottom: 3,
            }}
          >
            <Button
              style={{ flex: 1 }}
              onPress={() => {
                setStyle("stroke");
                setStrokeWidth(6)
              }}
              title="strokeWidth 6"
            />
            <Button
              style={{ flex: 1}}
              onPress={() => {
                setStyle("stroke");
                setStrokeWidth(8)
              }}
              title="strokeWidth 8"
            />
          </View>
        </TestCase>

        <TestCase itShould="case8: children 颜色渐变效果">
          <View
            style={{
              flexDirection: "row",
              gap: 12,
              marginVertical: 16,
              marginTop: 3,
              marginBottom: 3,
            }}
          >
            <Button
              style={{ flex: 1 }}
              onPress={() => {
                setLinearGradient(true);
              }}
              title="enable"
            />
            <Button
              style={{ flex: 1}}
              onPress={() => {
                setLinearGradient(false);
              }}
              title="disable"
            />
          </View>
        </TestCase>

        <TestCase itShould="case9: animate 属性 动画效果">
        <View
            style={{
              flexDirection: "row",
              gap: 12,
              marginTop: 3,
              marginBottom: 3,
            }}
          >
            <Button
              style={{ flex: 1 }}
              onPress={() => setData6((data6) => DATA(data6.length))}
              title="animate"
            />
          </View>
        </TestCase>

      </ScrollView>
    </Tester>
  );
}

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
    backgroundColor: appColors.viewBackground.light,
    $dark: {
      backgroundColor: appColors.viewBackground.dark,
    },
  },
  chart: {
    flex: 1,
  },
  optionsScrollView: {
    flex: 1,
    backgroundColor: appColors.androidHeader.dark,
    $dark: {
      backgroundColor: appColors.androidHeader.dark,
    },
  },
  options: {
    paddingHorizontal: 5,
    paddingVertical: 10,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
});