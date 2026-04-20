import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import Bootzie from '../assets/BootSmug.png'

const index = () => {
  const [currentView, setCurrentView] = useState('dashboard')

  // Stock state
  const [stockData, setStockData] = useState([
    { symbol: 'AAPL', price: 150.00, prevPrice: 150.00 },
    { symbol: 'GOOGL', price: 2800.00, prevPrice: 180.00 },
    { symbol: 'MSFT', price: 300.00, prevPrice: 13.00 },
    { symbol: 'TSLA', price: 250.00, prevPrice: 150.00 },
    { symbol: 'AMZN', price: 180.00, prevPrice: 180.00 },
    { symbol: 'NVDA', price: 120.00, prevPrice: 120.00 },
    { symbol: 'META', price: 350.00, prevPrice: 150.00 },
    { symbol: 'NFLX', price: 450.00, prevPrice: 120.00 },
    { symbol: 'AMD', price: 95.00, prevPrice: 95.00 },
    { symbol: 'INTC', price: 25.00, prevPrice: 25.00 },
  ])

  // Name state
  const [generatedNames, setGeneratedNames] = useState([])

  // Oil state
  const [pumps, setPumps] = useState(
    Array.from({ length: 10 }, (_, index) => ({ id: index + 1, active: false }))
  )
  const [oilPumped, setOilPumped] = useState(0)

  // useEffect for stocks
  useEffect(() => {
    const interval = setInterval(() => {
      setStockData(prevStocks =>
        prevStocks.map(stock => {
          const newPrice = Math.max(0, Math.min(200, stock.price + (Math.random() * 20 - 10)))
          return {
            ...stock,
            prevPrice: stock.price,
            price: newPrice
          }
        })
      )
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  // useEffect for oil
  useEffect(() => {
    const interval = setInterval(() => {
      const activeCount = pumps.filter(pump => pump.active).length
      if (activeCount > 0) {
        setOilPumped(prev => prev + activeCount)
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [pumps])

  const togglePump = pumpId => {
    setPumps(prevPumps =>
      prevPumps.map(pump =>
        pump.id === pumpId ? { ...pump, active: !pump.active } : pump
      )
    )
  }

  const activePumpCount = pumps.filter(pump => pump.active).length
  const pumpDisplayStatus = activePumpCount > 0 ? 'Running' : 'Idle'
  const pumpWarning = activePumpCount > 0 && activePumpCount <= 5
    ? 'WARNING LOW AMOUNT OF ACTIVE OIL PUMPS'
    : ''

  // Function to generate name group
  const generateName = () => {
    const firstNames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry']
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis']
    
    const nameGroup = []
    const usedNames = new Set()
    
    while (nameGroup.length < 5) {
      const first = firstNames[Math.floor(Math.random() * firstNames.length)]
      const last = lastNames[Math.floor(Math.random() * lastNames.length)]
      const fullName = `${first} ${last}`
      
      if (!usedNames.has(fullName)) {
        usedNames.add(fullName)
        nameGroup.push(fullName)
      }
    }
    
    setGeneratedNames(prev => [nameGroup, ...prev.slice(0, 2)])
  }

  const renderContent = () => {
    switch (currentView) {
      case 'stocks':
        const maxPrice = Math.max(...stockData.map(stock => stock.price))
        return (
          <View>
            <Text style={styles.title}>Stock Ticker</Text>
            {stockData.map(stock => {
              const change = stock.price - stock.prevPrice
              const changeText = change >= 0 ? `(+${change.toFixed(2)})` : `(${change.toFixed(2)})`
              const changeColor = change >= 0 ? '#4CAF50' : '#F44336'
              const percentage = (stock.price / maxPrice) * 100
              return (
                <View key={stock.symbol} style={styles.stockRow}>
                  <View style={styles.stockInfo}>
                    <Text style={styles.stockText}>
                      {stock.symbol}: ${stock.price.toFixed(2)} {' '}
                      <Text style={[styles.changeText, { color: changeColor }]}>
                        {changeText}
                      </Text>
                    </Text>
                  </View>
                  <View style={styles.barContainer}>
                    <View
                      style={[
                        styles.progressBar,
                        { width: `${percentage}%` }
                      ]}
                    />
                  </View>
                </View>
              )
            })}
          </View>
        )
      case 'oil':
        return (
          <View>
            <Text style={styles.title}>Oil Pump Monitor</Text>
            <Text style={styles.statusText}>Status: {pumpDisplayStatus}</Text>
            <Text style={styles.dataText}>Active Pumps: {activePumpCount}</Text>
            {pumpWarning ? <Text style={styles.warningText}>{pumpWarning}</Text> : null}
            <Text style={styles.oilText}>Oil Pumped: {oilPumped} barrels</Text>
            <Text style={styles.subtitle}>Pump Controls</Text>
            <View style={styles.pumpGrid}>
              {pumps.slice(0, 5).map(pump => (
                <TouchableOpacity
                  key={pump.id}
                  style={[
                    styles.pumpButton,
                    pump.active ? styles.pumpActive : styles.pumpInactive,
                  ]}
                  onPress={() => togglePump(pump.id)}
                >
                  <Text style={styles.pumpButtonText}>Pump {pump.id}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.pumpGrid}>
              {pumps.slice(5).map(pump => (
                <TouchableOpacity
                  key={pump.id}
                  style={[
                    styles.pumpButton,
                    pump.active ? styles.pumpActive : styles.pumpInactive,
                  ]}
                  onPress={() => togglePump(pump.id)}
                >
                  <Text style={styles.pumpButtonText}>Pump {pump.id}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )
      case 'names':
        return (
          <View>
            <Text style={styles.title}>Name Generator</Text>
            <TouchableOpacity style={styles.generateButton} onPress={generateName}>
              <Text style={styles.buttonText}>Generate Name Group</Text>
            </TouchableOpacity>
            <Text style={styles.subtitle}>Recent Groups:</Text>
            {generatedNames.map((group, groupIndex) => (
              <View key={groupIndex} style={styles.nameGroup}>
                <Text style={styles.groupTitle}>Group {groupIndex + 1}:</Text>
                {group.map((name, nameIndex) => (
                  <Text key={nameIndex} style={styles.nameText}>{name}</Text>
                ))}
              </View>
            ))}
          </View>
        )
      default:
        return (
          <View>
            <Text style={styles.title}>Dashboard</Text>
            
            <Text style={styles.sectionTitle}>Stock Ticker:</Text>
            {stockData
              .sort((a, b) => b.price - a.price)
              .slice(0, 3)
              .map(stock => (
                <Text key={stock.symbol} style={styles.dataText}>
                  {stock.symbol}: ${stock.price.toFixed(2)}
                </Text>
              ))}
            
            <Text style={styles.sectionTitle}>Oil Pump:</Text>
            <Text style={styles.dataText}>Status: {pumpDisplayStatus}</Text>
            <Text style={styles.dataText}>Active Pumps: {activePumpCount}</Text>
            {pumpWarning ? <Text style={styles.warningText}>{pumpWarning}</Text> : null}
            <Text style={styles.dataText}>Oil Pumped: {oilPumped} barrels</Text>
            
            <Text style={styles.sectionTitle}>Name Generator:</Text>
            {generatedNames.length > 0 && generatedNames[0].map((name, index) => (
              <Text key={index} style={styles.dataText}>{name}</Text>
            ))}
          </View>
        )
    }
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <View style={styles.imageRow}>
          <Image source={Bootzie} style={{ width: 200, height: 200 }} />
        </View>
        
        {renderContent()}
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => setCurrentView('stocks')}>
            <Text style={styles.buttonText}>Stocks</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => setCurrentView('oil')}>
            <Text style={styles.buttonText}>Oil</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => setCurrentView('names')}>
            <Text style={styles.buttonText}>Name Generator</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => setCurrentView('dashboard')}>
            <Text style={styles.buttonText}>Dashboard</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}

export default index

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#cccccc',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  dataText: {
    fontSize: 16,
    marginVertical: 2,
  },
  stockText: {
    fontSize: 18,
    marginVertical: 5,
  },
  statusText: {
    fontSize: 18,
    marginVertical: 10,
  },
  oilText: {
    fontSize: 18,
    marginVertical: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  nameText: {
    fontSize: 16,
    marginVertical: 2,
  },
  nameGroup: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  warningText: {
    fontSize: 16,
    color: '#B71C1C',
    fontWeight: 'bold',
    marginVertical: 6,
  },
  changeText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  pumpGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  pumpButton: {
    width: 100,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 6,
  },
  pumpActive: {
    backgroundColor: '#2E7D32',
  },
  pumpInactive: {
    backgroundColor: '#9E9E9E',
  },
  pumpButtonText: {
    color: '#fff',
    fontWeight: '600',
  },  imageRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
  generateButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  stockRow: {
    marginVertical: 8,
    paddingHorizontal: 10,
  },
  stockInfo: {
    marginBottom: 5,
  },
  barContainer: {
    height: 20,
    width: 100,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    marginLeft: 10,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 10,
  },
})