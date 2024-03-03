import React, { useEffect, useState } from "react";
import data from './data';
import './App.css';


function E6Search() {


    const [searchData, setSearchData] = useState([]);
    const [searchKey, setSearchKey] = useState('');
    const [booksData, setBooksData] = useState([]);


    // function for counting the search word and occurrence
    const countRepetitive = (temp) => {
        let largeText = temp.summary;
        let word = searchKey;
        let re = new RegExp(`${word}`, 'g');
        let isMatch = largeText.match(re)
        let wordCount = (isMatch || []).length;
        temp.wordCount = wordCount;
        temp.searchWord = word;
        return temp;
    };


    // function for finding the search word and filter the summary data
    const handleSearch = (e) => {
        let tempSearchData = Object.assign({}, data)
        const val = e.target.value;
        let updatedSearch = []
        let searchKey = val.toLowerCase();
        setSearchKey(val);
        if (Object.keys(tempSearchData).length > 0 && Array.isArray(tempSearchData.summaries) && tempSearchData.summaries.length > 0) {
            let filterData = tempSearchData.summaries.filter((item) => {
                return item.summary.toLowerCase().includes(searchKey)
            });
            filterData.forEach(element => {
                let data = countRepetitive(element);
                updatedSearch.push(data);
                setSearchData(updatedSearch);
                return updatedSearch;
            });
        }
        else if (searchKey == '') {
            setSearchData([]);
        }
    };


    // On Click on the suggestion, books data is getting prepared & displaying the books  4 box in a row
    const suggestedBooks = (suggestion) => {
        let book = [...booksData];
        let tempBookData = Object.assign({}, data);
        let summaryIndex = searchData.findIndex((el) => el.id === suggestion.id);
        let authorIndex = tempBookData['authors'].findIndex((el) => el.book_id === suggestion.id)
        if (summaryIndex > -1 && authorIndex > -1) {
            window.scrollTo(0, document.body.scrollHeight);
            let obj = {};
            let summary = searchData[summaryIndex].summary;
            let title = tempBookData.titles[suggestion.id];
            let author = tempBookData['authors'][authorIndex].author;
            obj.book_id = suggestion.id;
            obj.author_name = author;
            obj.book_title = title;
            obj.book_summary = summary;
            // I am not implementing the unique id thing to array, just to give experience is that on every click it will add a card.
            book.push(obj);  
        }
        // Unique Books Logic
        const key = 'book_id';
        const uniqueBooks = [...new Map(book.map(item =>
            [item[key], item])).values()];
        console.log(111, uniqueBooks);
        // if unique books is needed please update line number 67 - setBooksData(book) to setBooksData(uniqueBooks)
        setBooksData(book)
    };

    return (
        <div className='container'>
            <div className="title">E6 Search Engine</div>
            <div className="search-field">
                <input type="search" id="gsearch" name="gsearch" placeholder="Please Search/ Type here..." onChange={(e) => handleSearch(e)} />
            </div>
            <div className='result-tab'>
                <div className='ul-title'>
                    <p>Recent Search</p>
                </div>
                <div className="search-box">
                        <ul>
                            {
                                Array.isArray(searchData) && searchData.length > 0 &&
                                searchData.sort((a, b) => { return b.wordCount - a.wordCount }) &&
                                searchData.map((suggestion, index) =>
                                    <li className={`li-text li-${index}`} key={index} onClick={() => suggestedBooks(suggestion)}>
                                        {suggestion.summary}
                                    </li>
                                )
                            }
                        </ul>
                </div>
            </div>
            <div className="books-box">
                {
                    Array.isArray(booksData) && booksData.length > 0 &&
                    booksData.map((book, index) => 
                        <div class="books-listing" key={index}>
                        <div class="row">
                            <div class="box-image-container">
                                <img class="books-box-image" 
                                src={index % 2  === 0 ? "https://i1.pickpik.com/photos/442/929/164/workspace-workplace-computer-macbook-preview.jpg" : "https://miro.medium.com/v2/resize:fit:1358/0*omDFrtVSYjTbSn14"} 
                                role="presentation" 
                                alt="" />
                            </div>
                            <div class="books-listing-title" role="heading" aria-level="2" title={book.book_title}>
                                {book.book_title}
                            </div>
                            <div class="books-listing-summary" title={book.book_summary} role="heading" aria-level="3">
                                {book.book_summary}
                            </div>
                        </div>
                        <div class="books-listing-extra-info">
                            <div>
                                <img class="img-circle" src="https://lh3.googleusercontent.com/a/ACg8ocJ_2qyyq3PCLnB0jQ5AGSNS09rzipVdeiuCwdq7yOnFpf66=s88-w88-h88-c-k-no" alt="author" />
                                <span class="small books-author-name">
                                    {book.author_name}
                                </span>
                            </div>
                        </div>
                    </div>
                    )
                }
            </div>
        </div>
    )

}

export default E6Search;