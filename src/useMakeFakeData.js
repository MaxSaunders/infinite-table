import { Chance } from 'Chance'
import { useState } from 'react'

const chance = new Chance()

function makeRecord() {
    return {
        name: chance.name(),
        age: chance.age(),
        gender: chance.gender()
    }
}

const delay = 1000

function useMakeFakeData(pageSize = 20) {
    const [results, setResults] = useState([])
    const [allResults, setAllResults] = useState([])

    const getMore = (amount = pageSize) => {
        let fakeData = []
        for (let i = 0; i < amount; i++) {
            fakeData.push(makeRecord())
        }
        return fakeData
    }

    const _getNextPromise = () => {
        const newResults = getMore(pageSize)
        setResults(newResults)
        setAllResults(r => {
            return [...r, ...newResults]
        })
    }

    const getNext = () => new Promise((resolve, reject) => {
        // simulates the delay in an api call
        setTimeout(() => resolve(_getNextPromise()), (500 + chance.integer({ min: 0, max: delay })))
    })

    return {
        getMore,
        getNext,
        results,
        allResults
    }
}

export default useMakeFakeData
