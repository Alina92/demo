import React,{useState,useEffect} from 'react';
import './App.css';
import 'antd/dist/antd.css';
import * as d3 from 'd3';
import { Table, Form, Checkbox, Button} from 'antd';
const CheckboxGroup = Checkbox.Group;

const App=(props)=>{
  const [title,setTitle]=useState(null)
  const columns = [
    {
      dataIndex: 'name',
      key: 'name',
      render: text => <a>{text}</a>,
    },
    {
      title: 'Urgent',
      key: 'urgent',
      dataIndex: 'urgent',
      render: urgent => (
        <>
          <CheckboxGroup options={urgent} />
          <a>新增</a>
        </>
      ),
    },
    {
      title: 'NoUrgent',
      dataIndex: 'nourgent',
      key: 'nourgent',
    },
  ];

  const dataSource = [
    {
      key: '1',
      name: 'import',
      age: 32,
      address: 'New York No. 1 Lake Park',
      urgent: [{ label: 'new1', value: 'new1' },
      { label: 'new2', value: 'new2' }],
    },
    {
      key: '2',
      name: 'not import',
      age: 42,
      address: 'London No. 1 Lake Park',
      urgent: [{ label: 'new3', value: 'new3' },
      { label: 'new4', value: 'new4' }],
    },
  ];
  useEffect(()=>{
    const data = [
      {letter:'板块1',frequency:1},
      {letter:'板块2',frequency:8},
      {letter:'板块3',frequency:3},
      {letter:'板块4',frequency:3}]

    getLiner(data)
  })

  const getLiner=(data)=>{
    const containerWidth = 600
    const margin = {
      top: 80,
      right: 20,
      bottom: 30,
      left: 60
    }
    const width = containerWidth - margin.left - margin.right
    const height = 500 - margin.top - margin.bottom
    let chart = d3.select('#liner svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)

    let x = d3.scaleBand()
      .rangeRound([0, width])
      .padding(0.1)
      .domain(
        data.map(function(d) {
          return d.letter
        })
      ) // 设置x轴
    let y = d3
      .scaleLinear()
      .rangeRound([height, 0])
      .domain([
        0,
        d3.max(data, function(d) {
          return d.frequency
        })
      ]) // 设置y轴

    const barWidth = (width / data.length) * 0.9 // 用于绘制每条柱
    const stepArray = d3.ticks(0, d3.max(data, d => d.frequency), 10) // 用于生成背景柱
    const colors = ['#ccc', '#ddd'] // 用于生成背景柱

    let g = chart
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')') // 设最外包层在总图上的相对位置

    g.append('g') // 设置x轴
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x))

    g.append('g') // 设置y轴
      .attr('class', 'axis axis--y')
      .call(d3.axisLeft(y).ticks(5))
      .append('text')
      .attr('y', -16)
      .attr('dy', '.50em')
      .style('text-anchor', 'middle')
      .style('fill', '#fff')

    g.append('g') // 设置背景柱
      .attr('class', 'bar--bg-bar')
      .selectAll('rect')
      .data(d3.range(stepArray.length - 1))
      .enter()
      .append('rect')
      .attr('stroke', 'none')
      .attr('stroke-width', 0)
      .attr('fill', function(d, i) {
        return colors[i % 2]
      })
      .attr('x', 1)
      .attr('width', width)
      .attr('height', function(d, i) {
        return y(stepArray[i]) - y(stepArray[i + 1])
      })
      .attr('y', function(d, i) {
        return y((i + 1) * stepArray[1])
      })

    g.selectAll('.bar') // 画柱图
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('fill', '#8a2be2')
      .attr('x', function(d) {
        return x(d.letter)
      })
      .attr('y', height) // 控制动画由下而上
      .attr('width', x.bandwidth())
      .attr('height', 0) // 控制动画由下而上
      .transition()
      .duration(200)
      .ease(d3.easeBounceInOut)
      .delay(function(d, i) {
        return i * 200
      })
      .attr('y', function(d) {
        return y(d.frequency)
      })
      .attr('height', function(d) {
        return height - y(d.frequency)
      })

    g.append('g') // 输出柱图上的数值
      .attr('class', 'bar--text')
      .selectAll('text')
      .data(data)
      .enter()
      .append('text')
      .attr('fill', 'orange')
      .attr('font-size', '14px')
      .attr('text-anchor', 'middle')
      .attr('x', function(d, i) {
        return x(d.letter)
      })
      .attr('y', function(d) {
        return y(d.frequency)
      })
      .attr('dx', barWidth / 2)
      .attr('dy', '1em')
      .text(function(d) {
        return d.frequency
      })


    chart
      .append('g') // 输出标题
      .attr('class', 'bar--title')
      .append('text')
      .attr('fill', '#000')
      .attr('font-size', '16px')
      .attr('font-weight', '700')
      .attr('text-anchor', 'middle')
      .attr('x', containerWidth / 2)
      .attr('y', 20)
      .text('统计')
  }

  return (
    <div className="App">
      <div>
        <Table dataSource={dataSource} columns={columns} />
      </div>
      <div id='liner'>
        <svg width='600' height='600'></svg>
      </div>
    </div>
  );
}
export default App;

